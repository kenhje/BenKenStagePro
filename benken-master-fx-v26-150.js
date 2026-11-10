// One linked detector, identical gain on every discrete output channel.
class BenKenLinkedCompressor extends AudioWorkletProcessor{
 static get parameterDescriptors(){return [{name:'enabled',defaultValue:0,minValue:0,maxValue:1,automationRate:'k-rate'},{name:'threshold',defaultValue:-18,minValue:-60,maxValue:0,automationRate:'k-rate'},{name:'ratio',defaultValue:2,minValue:1,maxValue:12,automationRate:'k-rate'},{name:'makeup',defaultValue:0,minValue:0,maxValue:12,automationRate:'k-rate'},{name:'attack',defaultValue:10,minValue:1,maxValue:200,automationRate:'k-rate'},{name:'release',defaultValue:150,minValue:20,maxValue:1000,automationRate:'k-rate'},{name:'knee',defaultValue:6,minValue:0,maxValue:24,automationRate:'k-rate'}]}
 constructor(){super();this.running=true;this.port.onmessage=event=>{if(event.data?.command==='shutdown')this.running=false};this.gain=1;this.makeupGain=1;this.blocks=0;this.reduction=0}
 process(inputs,outputs,parameters){
  if(!this.running){for(const output of outputs)for(const channel of output)channel.fill(0);return false}
  const input=inputs[0]||[],output=outputs[0]||[],frames=output[0]?.length||128,enabled=parameters.enabled[0]>=.5,threshold=parameters.threshold[0],ratio=Math.max(1,parameters.ratio[0]),makeup=enabled?10**(parameters.makeup[0]/20):1,knee=parameters.knee[0],attack=Math.exp(-1/(sampleRate*parameters.attack[0]/1000)),release=Math.exp(-1/(sampleRate*(enabled ? parameters.release[0]/1000 : .005))),makeupSmoothing=Math.exp(-1/(sampleRate*.005)),slope=1/ratio-1;
  let reduction=0;
  for(let i=0;i<frames;i++){
   let peak=0;for(let c=0;c<input.length;c++)peak=Math.max(peak,Math.abs(input[c][i]||0));const db=20*Math.log10(Math.max(1e-12,peak)),over=db-threshold;
   const change=!enabled?0:knee&&Math.abs(over)<knee/2?slope*(over+knee/2)*(over+knee/2)/(2*knee):over<=-knee/2?0:slope*over,target=10**(change/20),coefficient=target<this.gain?attack:release;this.gain=coefficient*this.gain+(1-coefficient)*target;
   this.makeupGain=makeupSmoothing*this.makeupGain+(1-makeupSmoothing)*makeup;const gain=this.gain*this.makeupGain;for(let c=0;c<output.length;c++)output[c][i]=(input[c]?.[i]||0)*gain;reduction=Math.max(reduction,-20*Math.log10(Math.max(1e-12,this.gain)));
  }
  if(++this.blocks>=16){this.blocks=0;this.port.postMessage({reduction:enabled?reduction:0})}return true;
 }
}
registerProcessor('benken-linked-compressor',BenKenLinkedCompressor);
