-- Export selected REAPER stems and regions as one BenKen song update.
-- Requires REAPER 7.x. No SWS, Python or other extension is required.
local M = {}
local function array(t) return setmetatable(t or {}, {__json_array=true}) end
local function quote(s)
  return '"'..tostring(s):gsub('[%z\1-\31\\"]', function(c)
    local escapes={['"']='\\"',['\\']='\\\\',['\n']='\\n',['\r']='\\r',['\t']='\\t'}
    return escapes[c] or string.format('\\u%04x',string.byte(c))
  end)..'"'
end
local function json(value)
  local kind=type(value)
  if kind=='string' then return quote(value) end
  if kind=='number' then assert(value==value and math.abs(value)<math.huge,'Non-finite export value'); return string.format('%.15g',value) end
  if kind=='boolean' then return value and 'true' or 'false' end
  if kind=='nil' then return 'null' end
  assert(kind=='table','Unsupported export value')
  local out={}
  if getmetatable(value) and getmetatable(value).__json_array then
    for i=1,#value do out[#out+1]=json(value[i]) end
    return '['..table.concat(out,',')..']'
  end
  local keys={};for key in pairs(value) do keys[#keys+1]=key end;table.sort(keys)
  for _,key in ipairs(keys) do out[#out+1]=quote(key)..':'..json(value[key]) end
  return '{'..table.concat(out,',')..'}'
end
local function guid(value) return tostring(value):gsub('[{}]',''):lower() end
local function check(ok,message) if not ok then error(message,0) end end
local function color(value)
  if not value or value==0 then return nil end
  local r,g,b=reaper.ColorFromNative(value)
  return string.format('#%02x%02x%02x',r,g,b)
end
local function safe_name(value)
  return (value:gsub('[<>:"/\\|?*%z\1-\31]','_'):gsub('^%s+',''):gsub('%s+$',''))
end
local numeric_settings={'RENDER_SETTINGS','RENDER_BOUNDSFLAG','RENDER_STARTPOS','RENDER_ENDPOS','RENDER_CHANNELS','RENDER_SRATE','RENDER_TAILFLAG','RENDER_ADDTOPROJ','RENDER_NORMALIZE'}
local string_settings={'RENDER_FILE','RENDER_PATTERN','RENDER_FORMAT','RENDER_FORMAT2'}
local function snapshot()
  local saved={numeric={},strings={},selected={},mute={},solo={}}
  for _,key in ipairs(numeric_settings) do saved.numeric[key]=reaper.GetSetProjectInfo(0,key,0,false) end
  for _,key in ipairs(string_settings) do local _,v=reaper.GetSetProjectInfo_String(0,key,'',false);saved.strings[key]=v end
  for i=0,reaper.CountTracks(0)-1 do local track=reaper.GetTrack(0,i);saved.selected[track]=reaper.IsTrackSelected(track);saved.mute[track]=reaper.GetMediaTrackInfo_Value(track,'B_MUTE');saved.solo[track]=reaper.GetMediaTrackInfo_Value(track,'I_SOLO') end
  return saved
end
local function restore(saved)
  for key,value in pairs(saved.numeric) do reaper.GetSetProjectInfo(0,key,value,true) end
  for key,value in pairs(saved.strings) do reaper.GetSetProjectInfo_String(0,key,value,true) end
  for track,value in pairs(saved.selected) do reaper.SetTrackSelected(track,value);reaper.SetMediaTrackInfo_Value(track,'B_MUTE',saved.mute[track]);reaper.SetMediaTrackInfo_Value(track,'I_SOLO',saved.solo[track]) end
  reaper.TrackList_AdjustWindows(false);reaper.UpdateArrange()
end
local function regions(duration)
  local result=array();local _,markers,count=reaper.CountProjectMarkers(0)
  for i=0,markers+count-1 do
    local ok,is_region,start,finish,name,index,tint=reaper.EnumProjectMarkers3(0,i)
    if ok and ok~=0 and is_region then
      check(start>=0 and finish>start and finish<=duration+.001,'Regions must lie within this song, starting at or after zero.')
      result[#result+1]={id='region-'..index,name=name~='' and name or 'Region '..index,start=start,['end']=finish,color=color(tint)}
    end
  end
  table.sort(result,function(a,b)return a.start<b.start end)
  for i=2,#result do check(result[i].start>=result[i-1]['end']-.001,'Use non-overlapping section regions in this single-song project.') end
  return result
end
local function tempo_map()
  local result=array();local initial=reaper.TimeMap_GetDividedBpmAtTime(0)
  result[1]={time=0,bpm=initial}
  for i=0,reaper.CountTempoTimeSigMarkers(0)-1 do
    local ok,time,_,_,bpm,numerator,denominator,linear=reaper.GetTempoTimeSigMarker(0,i)
    if ok then
      local point={time=time,bpm=bpm,numerator=numerator,denominator=denominator,linear=linear}
      if time==0 then result[1]=point elseif time>0 then result[#result+1]=point end
    end
  end
  return result
end
local function pack(path,metadata,files)
  local data=json(metadata);check(#data<8*1024*1024,'Export metadata is too large.')
  local output=assert(io.open(path,'wb'));local ok,err=pcall(function()
    assert(output:write('BKSP0001',string.pack('<I4',#data),data))
    for _,file in ipairs(files) do
      local input=assert(io.open(file.path,'rb'));local written=0
      local copied,reason=pcall(function() while true do local chunk=input:read(1024*1024);if not chunk then break end;assert(output:write(chunk));written=written+#chunk end end)
      input:close();assert(copied,reason);check(written==file.size,'Rendered audio changed during packaging.')
    end
  end)
  local closed,close_error=output:close();assert(ok,err);assert(closed,close_error)
end
function M.run()
  local saved,render_dir,temp,outputs=nil,nil,nil,{};local result
  local ok,error_message=xpcall(function()
    check(reaper.GetPlayState()==0,'Stop REAPER playback before exporting.')
    check(math.abs(reaper.Master_GetPlayRate(0)-1)<.000001,'Set REAPER project playrate to 1.0 before exporting. Tempo-map changes are supported.')
    local _,project_file=reaper.EnumProjects(-1,'');check(project_file and project_file~='','Save this REAPER project before the first export.')
    local selected={};for i=0,reaper.CountSelectedTracks(0)-1 do selected[#selected+1]=reaper.GetSelectedTrack(0,i) end
    check(#selected>0 and #selected<=32,'Select the tracks or folder buses to export, usually up to six. Do not select every DI track below a selected folder.')
    local chosen={};for _,track in ipairs(selected) do chosen[track]=true end
    for _,track in ipairs(selected) do local parent=reaper.GetParentTrack(track);while parent do check(not chosen[parent],'Select a folder bus OR its child tracks, so the audio is not exported twice.');parent=reaper.GetParentTrack(parent) end end
    local _,destination=reaper.GetProjExtState(0,'BenKenExport','folder')
    if destination=='' then local accepted;accepted,destination=reaper.GetUserInputs('BenKen export folder',1,'Destination folder:',reaper.GetProjectPath('')..'/BenKen Exports');if not accepted then return end end
    check(destination~='' and not destination:find('[%z\r\n;]'),'Choose a valid destination folder without semicolons.')
    local project_duration=reaper.GetProjectLength(0);check(project_duration>0 and project_duration<=86400,'The project has no valid song duration.')
    local section_list=regions(project_duration);local default_end=#section_list>0 and section_list[#section_list]['end'] or project_duration
    local _,previous_format=reaper.GetProjExtState(0,'BenKenExport','format');local _,previous_end=reaper.GetProjExtState(0,'BenKenExport','endSeconds')
    local defaults=(previous_format~='' and previous_format or 'MP3,1')..','..(previous_end~='' and previous_end or string.format('%.6f',default_end))
    local accepted,settings=reaper.GetUserInputs('BenKen audio export',3,'Format MP3/WAV,Channels 1 mono / 2 stereo,End in seconds (0 = whole project)',defaults);if not accepted then return end
    local format,channels,finish=settings:upper():match('^%s*([%a%d]+)%s*,%s*([12])%s*,%s*([%d%.]+)%s*$');check(format=='MP3' or format=='WAV','Choose MP3 or WAV, channels 1 or 2, and an end time in seconds.');channels=tonumber(channels);finish=tonumber(finish)
    check(finish and finish>=0 and finish<=project_duration+.001,'Choose an end time within the project, or zero for the whole project.')
    local duration=finish==0 and project_duration or finish;check(duration>0,'Choose a positive song duration.')
    for _,region in ipairs(section_list) do check(region['end']<=duration+.001,'The export end is before a song region ends. Increase End in seconds.') end
    check(duration*48000*4*channels*#selected<=256*1024*1024,'These stems would exceed BenKen’s 256 MiB audio memory limit at 48 kHz. Export fewer tracks or choose mono.')
    local tempos=tempo_map()
    local _,project_id=reaper.GetProjExtState(0,'BenKenExport','projectId');local _,linked_file=reaper.GetProjExtState(0,'BenKenExport','projectFile')
    if project_id~='' and linked_file~='' and linked_file~=project_file then
      local answer=reaper.ShowMessageBox('This project has a different filename or location from its previous BenKen export.\n\nYES: create a separate BenKen song link (new song from a template).\nNO: keep the existing song link (only renamed or moved).\nCANCEL: do not export.','BenKen song link',3)
      if answer==2 then return end;if answer==6 then project_id='' end
    end
    if project_id=='' then project_id=guid(reaper.genGuid()) end
    local revision=guid(reaper.genGuid());local title=(project_file:match('([^/\\]+)$') or 'Song'):gsub('%.[Rr][Pp][Pp]$','')
    check(#title<=160,'Use a song title shorter than 160 bytes.')
    check(reaper.RecursiveCreateDirectory(destination,0)~=0,'The export folder could not be created.')
    render_dir=destination..'/.BenKen-render-'..revision;check(reaper.RecursiveCreateDirectory(render_dir,0)~=0,'The temporary render folder could not be created.')
    saved=snapshot()
    for track in pairs(saved.solo) do reaper.SetMediaTrackInfo_Value(track,'I_SOLO',0) end
    for _,key in ipairs({'RENDER_TAILFLAG','RENDER_ADDTOPROJ','RENDER_NORMALIZE'}) do reaper.GetSetProjectInfo(0,key,0,true) end
    reaper.GetSetProjectInfo(0,'RENDER_SETTINGS',2,true);reaper.GetSetProjectInfo(0,'RENDER_BOUNDSFLAG',0,true);reaper.GetSetProjectInfo(0,'RENDER_STARTPOS',0,true);reaper.GetSetProjectInfo(0,'RENDER_ENDPOS',duration,true);reaper.GetSetProjectInfo(0,'RENDER_CHANNELS',channels,true);reaper.GetSetProjectInfo(0,'RENDER_SRATE',48000,true)
    reaper.GetSetProjectInfo_String(0,'RENDER_FORMAT',format=='MP3' and 'l3pm' or 'evaw',true);reaper.GetSetProjectInfo_String(0,'RENDER_FORMAT2','',true);reaper.GetSetProjectInfo_String(0,'RENDER_FILE',render_dir,true)
    local tracks,links,assets=array(),array(),array();local total=0
    for _,track in ipairs(selected) do
      local source_id=guid(reaper.GetTrackGUID(track));local _,name=reaper.GetTrackName(track);check(#name<=160,'A selected track name is too long.')
      reaper.SetOnlyTrackSelected(track);reaper.SetMediaTrackInfo_Value(track,'B_MUTE',0);reaper.GetSetProjectInfo_String(0,'RENDER_PATTERN',source_id,true)
      local _,target=reaper.GetSetProjectInfo_String(0,'RENDER_TARGETS','',false);check(target~='' and not target:find(';'),'REAPER did not provide a single render destination for this stem.')
      check(target:sub(1,#render_dir+1)==render_dir..'/','REAPER render destination is outside the export folder.')
      outputs[#outputs+1]=target;reaper.Main_OnCommand(41824,0)
      local input=io.open(target,'rb');check(input~=nil,'Render cancelled or failed for '..name..'.');local size=input:seek('end');input:close();check(size>0 and size<=160*1024*1024,'The rendered file is empty or exceeds 160 MiB: '..name)
      if reaper.PCM_Source_CreateFromFile then local source=reaper.PCM_Source_CreateFromFile(target);check(source~=nil,'The rendered stem could not be opened: '..name);local length,is_qn=reaper.GetMediaSourceLength(source);reaper.PCM_Source_Destroy(source);check(not is_qn and math.abs(length-duration)<.3,'The rendered stem is incomplete: '..name) end
      total=total+size;check(total<=256*1024*1024,'The audio package exceeds 256 MiB. Choose MP3 or export fewer stems at a time.')
      local asset_id=source_id..'-'..revision;local filename=name..(format=='MP3' and '.mp3' or '.wav')
      tracks[#tracks+1]={id=source_id,assetId=asset_id,name=name,fileName=filename,fileBytes=size,stereo=channels==2,gain=1,pan=0,output=1,mute=false,solo=false,color=color(reaper.GetTrackColor(track)),muteGroups=array()}
      links[#links+1]={sourceId=source_id,trackId=source_id,name=name};assets[#assets+1]={id=asset_id,name=filename,type=format=='MP3' and 'audio/mpeg' or 'audio/wav',size=size};outputs[#outputs]={path=target,size=size}
      reaper.SetMediaTrackInfo_Value(track,'B_MUTE',saved.mute[track])
    end
    restore(saved);saved=nil
    local source={version=1,projectId=project_id,revision=revision,title=title,duration=duration,regions=section_list,tempoMap=tempos,trackLinks=links}
    local song={title=title,artist='',text='',duration=duration,originalBpm=tempos[1].bpm,reaperSource=source,playback={masterGain=1,tracks=tracks}}
    local metadata={format='BenKen Stage Pro',version=6,appVersion='REAPER Export 1',scope='song',state={songs=array({song}),sets={},set='',idx=0,opts={}},assets=assets}
    local final=destination..'/'..safe_name(title)..'.benken';temp=final..'.'..revision..'.tmp';pack(temp,metadata,outputs);local renamed,reason=os.rename(temp,final);check(renamed,'The previous export was kept; the new package could not be saved: '..tostring(reason));temp=nil
    reaper.SetProjExtState(0,'BenKenExport','projectId',project_id);reaper.SetProjExtState(0,'BenKenExport','projectFile',project_file);reaper.SetProjExtState(0,'BenKenExport','folder',destination);reaper.SetProjExtState(0,'BenKenExport','format',format..','..channels);reaper.SetProjExtState(0,'BenKenExport','endSeconds',tostring(finish));reaper.MarkProjectDirty(0)
    result={file=final,source=source};reaper.ShowMessageBox('Exported '..#tracks..' stems and '..#section_list..' regions (0–'..string.format('%.2f',duration)..' seconds):\n\n'..final..'\n\nSave this REAPER project to keep its BenKen link. Import the .benken file in BenKen > Mixer Settings > Audio & Files > IMPORT / UPDATE FROM REAPER.','BenKen export',0)
  end,function(err)return tostring(err) end)
  if saved then pcall(restore,saved) end
  for _,file in ipairs(outputs) do os.remove(type(file)=='table' and file.path or file) end
  if temp then os.remove(temp) end;if render_dir then os.remove(render_dir) end
  if not ok then reaper.ShowMessageBox(error_message,'BenKen export stopped',0);return nil,error_message end
  return result
end
M.json=json;M.array=array;M.regions=regions;M.tempo_map=tempo_map
if not rawget(_G,'BENKEN_EXPORT_TEST') then M.run() end
return M
