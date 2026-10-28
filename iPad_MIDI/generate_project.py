#!/usr/bin/env python3
"""Generate a dependency-free, iPad/iPhone MIDI companion Xcode project."""
import hashlib
import json
from pathlib import Path
import plistlib

root=Path(__file__).resolve().parent
project=root/'BenKenStagePro.xcodeproj'
project.mkdir(exist_ok=True)
uid=lambda value:hashlib.sha1(value.encode()).hexdigest()[:24].upper()
q=lambda s:json.dumps(str(s))
objects=[]
def add(name,body):
    identifier=uid(name);objects.append(f'\t\t{identifier} = {{ {body} }};');return identifier
sources=['BenKenMIDIApp.swift','MIDIService.swift']
files=sources+['Info.plist']
refs={}
types={'.swift':'sourcecode.swift','.mm':'sourcecode.cpp.objcpp','.h':'sourcecode.c.h','.hpp':'sourcecode.cpp.h','.plist':'text.plist.xml','.entitlements':'text.plist.entitlements'}
for filename in files:
    refs[filename]=add('file:'+filename,f'isa = PBXFileReference; lastKnownFileType = {q(types[Path(filename).suffix])}; path = {q(filename)}; sourceTree = "<group>";')
icons=add('assets','isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = Assets.xcassets; sourceTree = "<group>";')
product=add('product','isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = "BenKen Stage Pro.app"; sourceTree = BUILT_PRODUCTS_DIR;')
frameworks=[]
for name in ['AVFoundation','CoreMIDI','CoreAudioKit','WebKit','SwiftUI']:
    ref=add('framework:'+name,f'isa = PBXFileReference; lastKnownFileType = wrapper.framework; name = {name}.framework; path = System/Library/Frameworks/{name}.framework; sourceTree = SDKROOT;')
    frameworks.append(add('framework-build:'+name,f'isa = PBXBuildFile; fileRef = {ref};'))
source_builds=[add('build:'+name,f'isa = PBXBuildFile; fileRef = {refs[name]};')for name in sources]
asset_build=add('assets-build',f'isa = PBXBuildFile; fileRef = {icons};')
source_phase=add('sources','isa = PBXSourcesBuildPhase; buildActionMask = 2147483647; files = ('+','.join(source_builds)+'); runOnlyForDeploymentPostprocessing = 0;')
resource_phase=add('resources',f'isa = PBXResourcesBuildPhase; buildActionMask = 2147483647; files = ({asset_build}); runOnlyForDeploymentPostprocessing = 0;')
framework_phase=add('framework-phase','isa = PBXFrameworksBuildPhase; buildActionMask = 2147483647; files = ('+','.join(frameworks)+'); runOnlyForDeploymentPostprocessing = 0;')
products=add('products',f'isa = PBXGroup; children = ({product}); name = Products; sourceTree = "<group>";')
group=add('group','isa = PBXGroup; children = ('+','.join(list(refs.values())+[icons,products])+'); sourceTree = "<group>";')
project_configs=[];target_configs=[]
common={'CLANG_ENABLE_OBJC_ARC':'YES','CLANG_CXX_LANGUAGE_STANDARD':'c++17','CLANG_CXX_LIBRARY':'libc++','SWIFT_VERSION':'5.0','IPHONEOS_DEPLOYMENT_TARGET':'17.0','MACOSX_DEPLOYMENT_TARGET':'13.6','SDKROOT':'iphoneos','SUPPORTED_PLATFORMS':'iphoneos iphonesimulator','ENABLE_USER_SCRIPT_SANDBOXING':'NO'}
target_common={'PRODUCT_NAME':'BenKen Stage Pro','PRODUCT_BUNDLE_IDENTIFIER':'no.benken.stagepro.midicompanion','INFOPLIST_FILE':'Info.plist','GENERATE_INFOPLIST_FILE':'NO','CODE_SIGN_STYLE':'Automatic','TARGETED_DEVICE_FAMILY':'1,2','SUPPORTS_MACCATALYST':'NO','MARKETING_VERSION':'26.21','CURRENT_PROJECT_VERSION':'2621','ASSETCATALOG_COMPILER_APPICON_NAME':'AppIcon','ENABLE_HARDENED_RUNTIME':'YES','LD_RUNPATH_SEARCH_PATHS':'$(inherited) @executable_path/Frameworks @executable_path/../Frameworks','ENABLE_APP_SANDBOX':'NO'}
for name in ['Debug','Release']:
    conf={**common,'SWIFT_OPTIMIZATION_LEVEL':'-Onone'if name=='Debug'else'-O','GCC_OPTIMIZATION_LEVEL':'0'if name=='Debug'else'3','DEBUG_INFORMATION_FORMAT':'dwarf'if name=='Debug'else'dwarf-with-dsym'}
    project_configs.append(add('project-config:'+name,'isa = XCBuildConfiguration; buildSettings = {'+' '.join(f'{q(k)} = {q(v)};'for k,v in conf.items())+'}; name = '+name+';'))
    target_configs.append(add('target-config:'+name,'isa = XCBuildConfiguration; buildSettings = {'+' '.join(f'{q(k)} = {q(v)};'for k,v in target_common.items())+'}; name = '+name+';'))
config_list=add('project-configs','isa = XCConfigurationList; buildConfigurations = ('+','.join(project_configs)+'); defaultConfigurationIsVisible = 0; defaultConfigurationName = Release;')
target_list=add('target-configs','isa = XCConfigurationList; buildConfigurations = ('+','.join(target_configs)+'); defaultConfigurationIsVisible = 0; defaultConfigurationName = Release;')
target=add('target',f'isa = PBXNativeTarget; buildConfigurationList = {target_list}; buildPhases = ({source_phase},{framework_phase},{resource_phase}); buildRules = (); dependencies = (); name = BenKenStagePro; productName = "BenKen Stage Pro"; productReference = {product}; productType = "com.apple.product-type.application";')
project_id=add('project',f'isa = PBXProject; attributes = {{ LastUpgradeCheck = 1600; BuildIndependentTargetsInParallel = YES; }}; buildConfigurationList = {config_list}; compatibilityVersion = "Xcode 15.0"; developmentRegion = en; hasScannedForEncodings = 0; knownRegions = (en,nb,Base); mainGroup = {group}; productRefGroup = {products}; projectDirPath = ""; projectRoot = ""; targets = ({target});')
(project/'project.pbxproj').write_text('// !$*UTF8*$!\n{\n\tarchiveVersion = 1;\n\tclasses = {};\n\tobjectVersion = 56;\n\tobjects = {\n'+'\n'.join(objects)+'\n\t};\n\trootObject = '+project_id+';\n}\n')
scheme_dir=project/'xcshareddata/xcschemes';scheme_dir.mkdir(parents=True,exist_ok=True)
scheme=f'''<?xml version="1.0" encoding="UTF-8"?><Scheme LastUpgradeVersion="1600" version="1.3"><BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES"><BuildActionEntries><BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="YES" buildForArchiving="YES" buildForAnalyzing="YES"><BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{target}" BuildableName="BenKen Stage Pro.app" BlueprintName="BenKenStagePro" ReferencedContainer="container:BenKenStagePro.xcodeproj"/></BuildActionEntry></BuildActionEntries></BuildAction><LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="YES"><BuildableProductRunnable runnableDebuggingMode="0"><BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{target}" BuildableName="BenKen Stage Pro.app" BlueprintName="BenKenStagePro" ReferencedContainer="container:BenKenStagePro.xcodeproj"/></BuildableProductRunnable></LaunchAction><ProfileAction buildConfiguration="Release" shouldUseLaunchSchemeArgsEnv="YES" savedToolIdentifier="" useCustomWorkingDirectory="NO" debugDocumentVersioning="YES"/><AnalyzeAction buildConfiguration="Debug"/><ArchiveAction buildConfiguration="Release" revealArchiveInOrganizer="YES"/></Scheme>'''
(scheme_dir/'BenKenStagePro.xcscheme').write_text(scheme)
info={'CFBundleDevelopmentRegion':'en','WKAppBoundDomains':['kenhje.github.io'],'NSBluetoothAlwaysUsageDescription':'Connect your Bluetooth MIDI foot controller to BenKen.','CFBundleExecutable':'$(EXECUTABLE_NAME)','CFBundleIdentifier':'$(PRODUCT_BUNDLE_IDENTIFIER)','CFBundleInfoDictionaryVersion':'6.0','CFBundleName':'BenKen Stage Pro','CFBundlePackageType':'APPL','CFBundleShortVersionString':'$(MARKETING_VERSION)','CFBundleVersion':'$(CURRENT_PROJECT_VERSION)','UIApplicationSupportsIndirectInputEvents':True,'UIApplicationSceneManifest':{'UIApplicationSupportsMultipleScenes':False},'UILaunchScreen':{},'UIBackgroundModes':['audio'],'UISupportedInterfaceOrientations':['UIInterfaceOrientationPortrait','UIInterfaceOrientationLandscapeLeft','UIInterfaceOrientationLandscapeRight'],'UISupportedInterfaceOrientations~ipad':['UIInterfaceOrientationPortrait','UIInterfaceOrientationPortraitUpsideDown','UIInterfaceOrientationLandscapeLeft','UIInterfaceOrientationLandscapeRight'],'LSSupportsOpeningDocumentsInPlace':True,'UTExportedTypeDeclarations':[{'UTTypeIdentifier':'no.benken.stage-project','UTTypeDescription':'BenKen Stage Pro Project','UTTypeConformsTo':['public.data'],'UTTypeTagSpecification':{'public.filename-extension':['benken'],'public.mime-type':'application/x-benken-project'}}],'CFBundleDocumentTypes':[{'CFBundleTypeName':'BenKen Project','CFBundleTypeRole':'Editor','LSItemContentTypes':['no.benken.stage-project']}]}
info['UTExportedTypeDeclarations'].append({'UTTypeIdentifier':'no.benken.full-backup','UTTypeDescription':'BenKen Full Backup Part','UTTypeConformsTo':['public.data'],'UTTypeTagSpecification':{'public.filename-extension':['benkenbackup'],'public.mime-type':'application/x-benken-backup'}})
info['CFBundleDocumentTypes'].append({'CFBundleTypeName':'BenKen Full Backup','CFBundleTypeRole':'Editor','LSItemContentTypes':['no.benken.full-backup']})
with(root/'Info.plist').open('wb')as f:plistlib.dump(info,f)

print('Xcode project generated.')
