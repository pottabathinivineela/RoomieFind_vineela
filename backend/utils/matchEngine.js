const W={budget:0.30,location:0.25,lifestyle:0.25,gender:0.20};
function budgetScore(a,b){
  const lo=Math.max(a.budgetMin,b.budgetMin),hi=Math.min(a.budgetMax,b.budgetMax);
  const union=Math.max(a.budgetMax,b.budgetMax)-Math.min(a.budgetMin,b.budgetMin);
  return union>0?Math.max(0,(hi-lo)/union):0;
}
function locationScore(a,b){
  if(!a.preferredArea||!b.preferredArea)return 0.5;
  return a.preferredArea.toLowerCase()===b.preferredArea.toLowerCase()?1:0.3;
}
function lifestyleScore(a,b){
  const smoke=a.smoking===b.smoking?1:0;
  const sm={early:0,flexible:1,night_owl:2};
  const sd=Math.abs((sm[a.sleepSchedule]||1)-(sm[b.sleepSchedule]||1));
  const sleep=sd===0?1:sd===1?0.5:0;
  const clean=Math.max(0,1-Math.abs((a.cleanliness||3)-(b.cleanliness||3))/4);
  return(smoke+sleep+clean)/3;
}
function genderScore(a,b){
  if(a.genderPref==="any"||b.genderPref==="any")return 1;
  if(a.genderPref===b.gender&&b.genderPref===a.gender)return 1;
  if(a.genderPref===b.gender||b.genderPref===a.gender)return 0.7;
  return 0;
}
function computeCompatibility(a,b){
  if(a.userId===b.userId)return 0;
  const s={budget:budgetScore(a,b),location:locationScore(a,b),lifestyle:lifestyleScore(a,b),gender:genderScore(a,b)};
  return Math.round(Object.entries(W).reduce((t,[k,w])=>t+w*s[k],0)*100);
}
module.exports={computeCompatibility};
