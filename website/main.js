class Song {
  constructor(title, album, artist, mp3url) {
	this.title = title;
	this.album = album;
	this.artist = artist;
	this.mp3url = mp3url;
  }
}

var STATIC_HOST_URL = "localhost:666"

//var wrapper
var artistWrapper
var albumWrapper
var songWrapper

var backButton

// var pauseButton
var prevButton
var nextButton

var albumsURL
var songsURL
var currentView = 0

var audio
var playlist
var playingIndex

var queuePos
var selectedSong

var darkStyle = false

$(document).ready(function() {
	document.addEventListener('contextmenu', event => event.preventDefault());
	//wrapper = $(".wrapper")
	artistWrapper = $("#artistWrapper")
	albumWrapper = $("#albumWrapper")
	songWrapper = $("#songWrapper")
	
	backButton = $("#backButton")
	curSongDisplay = $("#curSongDisplay")
	
	prevButton = $(".controlBarButton").first()
	// pauseButton = prevButton.next()
	nextButton = prevButton.next().next()
	
	prevButton.click(function(e){
		playPrev()
	})
	// pauseButton.click(function(e){
		// pause()
	// })
	nextButton.click(function(e){
		playNext()
	})
	
	backButton.click(function(e){
		if (currentView > 1)
			loadAlbums()
		else
			loadArtists()
	})
	
	$("#styleButton").click(function(e){
		if(!darkStyle)
		{
			darkStyle = true
			loadDarkStyle()
		}
		else
		{
			darkStyle = false
			loadLightStyle()
		}
	})
	
	window.onbeforeunload = function(e) {
		return 'Are you sure you want to exit?'
	}
	
	$("#closerightclickdiv").click(function(e){
		$("#rightclickdiv").css("display","none")
	})
	$("#closelyricsdiv").click(function(e){
		$("#lyricsdiv").css("display","none")
	})
	$("#lyricsbutton").click(function(e){
		var win = window.open("https://breast-fed-steriliz.000webhostapp.com/lyricsGetter.php?data=" + fixStringForURL(selectedSong.artist) + "\\" + fixStringForURL(selectedSong.album) + "\\" + fixStringForURL(selectedSong.title), '_blank');
		win.focus();
		/*const axURL = "getreq.php?url=http://lc.pe.hu/lyricsGetter.php?data=" + fixStringForURL(selectedSong.attr("artist"))+"\\"+fixStringForURL(selectedSong.attr("album"))+"\\"+fixStringForURL(selectedSong.attr("title"))
		$.ajax({
		type: 'GET',
		url: axURL,
		success: function(data){
				$("#lyricstext").html(data);
				$("#lyricsdiv").css("display","block")
			}
		})
		
		//alert(selectedSong.attr("title"))*/
		$("#rightclickdiv").css("display","none")
		
	})
	$("#addnextbutton").click(function(e){
		playlist.splice(playingIndex+1, 0, new Song(selectedSong.title, selectedSong.album, selectedSong.artist, selectedSong.mp3url))
		$("#rightclickdiv").css("display","none")
	})
	$("#addtoqueuebutton").click(function(e){
		playlist.splice(queuePos, 0, new Song(selectedSong.title, selectedSong.album, selectedSong.artist, selectedSong.mp3url))
		queuePos++
		$("#rightclickdiv").css("display","none")
	})
	$("#downloadbutton").click(function(e){
		window.open(selectedSong.mp3url)
		$("#rightclickdiv").css("display","none")
	})
	$("#getlinkbutton").click(function(e){
		
	})

	initializeAudio()
	
	loadArtists()
})

function pause()
{
	if(audio.paused)
	{
		audio.play()
		// pauseButton.empty().append("P")
	}
	else
	{
		audio.pause()
		// pauseButton.empty().append("p")
	}
}

function playNext()
{
	if(audio && playlist[playingIndex + 1])
	{
		playingIndex++
		if(queuePos == playingIndex)
			queuePos++
		
		audio.src = playlist[playingIndex].mp3url
		curSongDisplay.html(playlist[playingIndex].title)
		audio.play()
		loadLyrics(playlist[playingIndex])
	}
}
function playPrev()
{
	if(audio && playlist[playingIndex - 1])
	{
		playingIndex--
		
		audio.src = playlist[playingIndex].mp3url
		curSongDisplay.html(playlist[playingIndex].title)
		audio.play()
		loadLyrics(playlist[playingIndex])
	}
}

function initializeAudio()
{
	// audio = new Audio()
	audio = $("#audioElement").get(0)

	audio.addEventListener("ended", function(){
		playNext()
	})
}

function loadArtists()
{
	songWrapper.hide()
	albumWrapper.hide()
	artistWrapper.show()

	currentView = 0
	//backButton.animate({opacity: '0'}, 400, function(){backButton.css("visibility", "hidden")})
	artistWrapper.empty()
	//wrapper.empty()
	$.ajax({
		type: 'GET',
		url: 'https://raw.githubusercontent.com/shiabehugo/48otw/master/data/artists.dat',
		success: function(data){
			var split = data.split('\n')
			for(i=0;i<split.length;i++)
			{
				if(split[i].length>1)
				{
					var lineSplit = split[i].split('\\')
					artistWrapper.append(artistBox(lineSplit[0], lineSplit[1]))
					//wrapper.append(artistBox(lineSplit[0], lineSplit[1]))
				}
			}
			
			$(".box").click(function(e){
				albumsURL = $(this).attr("albumsurl")
				loadAlbums()
			})
			
			if(darkStyle) loadDarkStyle()
		}
	})
}
function loadAlbums()
{
	songWrapper.hide()
	artistWrapper.hide()
	albumWrapper.show()

	currentView = 1
	//backButton.css("visibility", "visible").animate({opacity: '1'}, 400)
	albumWrapper.empty()
	//wrapper.empty()
	const ajaxURL = albumsURL

	$.ajax({
		type: 'GET',
		url: ajaxURL,
		success: function(data){
			var split = data.split('\n')
			for (i = 0; i < split.length; i++)
			{
				if(split[i].length>1)
				{
					var lineSplit = split[i].split('\\')
					albumWrapper.append(albumBox(lineSplit[0], lineSplit[1], lineSplit[2]))
					//wrapper.append(albumBox(lineSplit[0], lineSplit[1], lineSplit[2]))
				}
			}
			
			$(".albumBox").click(function(e){
				//openPopUP()
				songsURL = $(this).attr("songlisturl")
				loadSongs()
			})
			if(darkStyle) loadDarkStyle()
		}
	})
}
function loadSongs()
{
	artistWrapper.hide()
	albumWrapper.hide()
	songWrapper.show()

	currentView = 2
	//backButton.css("visibility", "visible").animate({opacity: '1'}, 400)
	songWrapper.empty()
	//wrapper.empty()
	const ajaxURL = songsURL

	$.ajax({
		type: 'GET',
		url: ajaxURL,
		success: function(data){
			var split = data.split('\n');
			var firstlinesplit = split[0].split('\\')
			var ar = firstlinesplit[0]
			var al = firstlinesplit[1]
			for (i = 1; i < split.length; i++)
			{
				if(split[i].length>1)
				{
					var lineSplit = split[i].split('\\')
					songWrapper.append(songBox(lineSplit[0], al, ar, `http://${STATIC_HOST_URL}/${lineSplit[1]}`, i))
					//wrapper.append(songBox(lineSplit[0], al, ar, lineSplit[1], i))
				}
			}
			$(".box").mousedown(function(event) {
				switch (event.which) {
					case 3:
						selectedSong = new Song($(this).attr("title"), $(this).attr("album"), $(this).attr("artist"), $(this).attr("mp3url"))
						$("#rightclickdiv").css("display","block")
						break
				}
			})
			$(".box").click(function(e){
				
				$(".controlBarButton").css("visibility", "visible").animate({opacity: '1'}, 400)
				
				/*if(!audio)
					initializeAudio()*/
				
				playlist = []
				playingIndex = parseInt($(this).attr("index"))
				queuePos = playingIndex+1
				
				var locatedCorrectly = false
				var currentElement = $("#songWrapper .box").first()
				while (currentElement.length > 0)
				{
					//console.log(currentElement)
					const isong = new Song(currentElement.attr("title"), currentElement.attr("album"), currentElement.attr("artist"), currentElement.attr("mp3url"))
					//console.log(isong)
					playlist.push(isong)
					//playlist.push(currentElement.attr("mp3url"))
					currentElement = currentElement.next()
				}
				
				loadLyrics(new Song($(this).attr("title"), $(this).attr("album"), $(this).attr("artist"), $(this).attr("mp3url")))
				
				audio.src = playlist[playingIndex].mp3url
				curSongDisplay.html(playlist[playingIndex].title)
				audio.play()
				pauseButton.empty().append("P")
			})
			if(darkStyle) loadDarkStyle()
		}
	})
}

function loadLyrics(song)
{
	const axURL = `lyricsGetter.php?data=${fixStringForURL(song.artist)}\\${fixStringForURL(song.album)}\\${fixStringForURL(song.title)}`
		$.ajax({
		type: 'GET',
		url: axURL,
		success: function(data){

				var wrapperContent = ""
				for (var i = 0; i < data.length; i++)
				{
					wrapperContent += data.charAt(i);
					if (data.charAt(i) === '\n')
						wrapperContent += "<br>"
				}
				$("#lyricswrapper").html(wrapperContent)
			}
		})
}

function artistBox(artistName, albumsURL)
{
	return `<div class="box" albumsurl="${albumsURL}"><p class="boxTextLeft">${artistName}</p></div>`
}
function albumBox(title, songlistURL, imageURL)
{
	
	return `<div class="albumBox" songlisturl="${songlistURL}"><img style="width: 100%;" src="${imageURL}"><div class="albumBoxText">${title}</div></div>`
}
function songBox(title, album, artist, mp3url, songNumber)
{
	return `<div class="box" index="${songNumber-1}" mp3url="${mp3url}" artist="${artist}" album="${album}" title="${title}"><p style="width: 40px; text-align: left;" class="boxTextLeft">${songNumber}</p><p class="boxTextLeft">${title}</p></div>`
}

function loadDarkStyle(){
	$(".box").css("color", "#bbb")
	$(".albumBox").css("color", "#bbb")
	$(".albumBox").css("border", "1px solid #444")
	//wrapper.css("border-left", "1px solid #444")
	//wrapper.css("border-right", "1px solid #444")
	$("body").css("background-color", "black")
}
function loadLightStyle(){
	$(".box").css("color", "black")
	$(".albumBox").css("color", "black")
	//wrapper.css("border-left", "1px solid #eee")
	//wrapper.css("border-right", "1px solid #eee")
	$("body").css("background-color", "white")
	$("#topBar").css("border", "none")
	$("#controlBar").css("border", "none")
}

function fixStringForURL(text){
	var result = ""
	for(i = 0; i < text.length; i++)
	{
		if(text[i] != ' ')
			result+=text[i]
			//result+="%20"
		//else
			//result+=text[i]
	}
	return result;
}

var ra = 0;
function openPopUP() {
	window.open('http://simizer.com/yFC', ra.toString(), 'toolbar=no,status=no,width=350,height=135')
	ra++
}
