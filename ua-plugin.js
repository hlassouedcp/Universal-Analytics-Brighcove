//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//****	An HTML Tag To Track BrightCove Events : Compatible with Universal Analytics and the dataLayer concept	****//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Step 1: Change the experienceID value with your experience ID.
// Step 2: Create a new Tag on Google Tag Manager
// Step 3: Select Cutom HTML Tag
// Step 4: Copy/Paste this on Configure Tag HTML section
// Step 5: Fire On: All Pages

<script>

////////////////// Check if Brighcove API exists ////////////////////

  if(typeof brightcove.api!="object"){
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = "//admin.brightcove.com/js/api/SmartPlayerAPI.js";
	document.body.appendChild(s);
  };

 /////////////////////////////////////////////////////////////////////


/// Please, set this to your experience ID
experienceID="myExperience";
/// Vars
var player,APIModules,videoPlayer;
var lastP=[];/// Last Position for the Progress Calculation


function trackBrightCove(){

	if(typeof brightcove!="undefined" && brightcove.hasOwnProperty("api") && brightcove.api.hasOwnProperty("getExperience") && brightcove.api.getExperience(experienceID)){
		
		player = brightcove.api.getExperience(experienceID);
		APIModules = brightcove.api.modules.APIModules;
		cuePointEvent = brightcove.api.events.CuePointEvent;
		videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
		 
		videoPlayer.addEventListener(brightcove.api.events.MediaEvent.PLAY, function(event) {onPlay(event)});
		videoPlayer.addEventListener(brightcove.api.events.MediaEvent.STOP, function(event) {onStop(event)});
		videoPlayer.addEventListener(brightcove.api.events.MediaEvent.PROGRESS, function(event) {onProgress(event)});
		  
		var onPlay = function(evt) {
			dataLayer.push({
				event: "video",
				eventAction: "play",
				eventLabel: evt.media.displayName
			})
		 }
		 
		var onStop = function(evt) {
			dataLayer.push({
				event: "video",
				eventAction: "stop",
				eventLabel: evt.media.displayName
			})
		 }
		 var onProgress = function(evt) {
			var duration=evt.duration;
			var position=evt.position;
			var t=duration-position<= 1.5 ? 1 : (Math.floor(position / duration * 4) / 4).toFixed(2); 
			
			if (!lastP[evt.media.id]|| t > lastP[evt.media.id]) {
			 lastP[evt.media.id]=t;

			 dataLayer.push({
					event: "video",
					eventAction: t * 100 + "%",
					eventLabel: evt.media.displayName
				})
			}
		}
	}else{
		setTimeout(function(){ 
			trackBrightCove();
		  }, 200);
	 }
}
trackBrightCove();
</script>
