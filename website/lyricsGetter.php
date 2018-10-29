<?php



function GetTag($html, $startPosition){
    $return = $html[$startPosition+1];
    $startPosition++;
    while($html[$startPosition] != ">"){
        $return .= $html[$startPosition];
        $startPosition++;
    }
    return $return;
}//call at <, returns inner text
function ExecuteGeniusLyrics($url/*, $path*/){
    $azstart = "<p>";
    $azend = "</p>";

    $lyricsHtml = /*curl($url);*/file_get_contents($url);

    $azstartpos = strpos($lyricsHtml, $azstart) + strlen($azstart);
    $lyricsHtml = substr($lyricsHtml, $azstartpos);
    $lyricsHtml = substr($lyricsHtml, 0, strpos($lyricsHtml, $azend));

    //echo $html;

    $intag = false;
    $result = "";
    for($i = 0; $i < strlen($lyricsHtml); $i++)
    {
        if(!$intag)
        {
            if($lyricsHtml[$i] != "<")
                $result .= $lyricsHtml[$i];
            else
                $intag = true;
        }
        else
        {
            $tag = GetTag($lyricsHtml, $i);
            $i += strlen($tag);
            switch($tag){
                case "br":
                    $result .= "\n";
                    break;
            }
            $intag = false;
        }
    }

    return $result;
    //echo $result;
    //$newfile = fopen($path, "w");

    //fwrite($newfile, $result);
}
function ExecuteAZLyrics($url){
    $azstart = "Sorry about that. -->";
    $azend = "</div>";

    $lyricsHtml = /*curl($url);*/file_get_contents($url);

    $azstartpos = strpos($lyricsHtml, $azstart) + strlen($azstart) + 2;
    $lyricsHtml = substr($lyricsHtml, $azstartpos);
    $lyricsHtml = substr($lyricsHtml, 0, strpos($lyricsHtml, $azend)-1);

    //echo $html;

    $intag = false;
    $result = "";
    for($i = 0; $i < strlen($lyricsHtml); $i++)
    {
        if(!$intag)
        {
            if($lyricsHtml[$i] != "<")
                $result .= $lyricsHtml[$i];
            else
                $intag = true;
        }
        else
        {
            $tag = GetTag($lyricsHtml, $i);
            $i += strlen($tag);
            switch($tag){
                case "br":
                    $result .= "\n";
                    break;
            }
            $intag = false;
        }
    }



    return $result;
    //$newfile = fopen($path, "w");

    //fwrite($newfile, $result);
}

function FixStringForURL($string){
    $stringout = "";
    for($i = 0; $i < strlen($string);$i++)
    {
        if($string[$i]==" ")
            $stringout .= "%20";
        else
            $stringout .= $string[$i];
    }
    return $stringout;
}

function GoogleSearchForLyrics($artist, $song, $lyricsWebsite){
    $fixedArtist = FixStringForURL($artist);
    $fixedSong = FixStringForURL($song);
    
    $googleSearchHTML = file_get_contents("https://www.google.es/search?q=" . $fixedArtist . "%20" . $fixedSong . "%20lyrics");
    
    //echo $googleSearchHTML;
    
    $urlStartPos = strpos($googleSearchHTML, $lyricsWebsite);
    $googleSearchHTML = substr($googleSearchHTML, $urlStartPos);
    $googleSearchHTML = substr($googleSearchHTML, 0, strpos($googleSearchHTML, "&"));
    //echo "azlyrics link: " . $googleSearchHTML;
    return $googleSearchHTML;
}
/*
function AddLineBreaks($text){
    
    $result = "";
    $array = str_split($text);
    foreach ($array as $char) {
            
        $result .= $char;
        
        if ($char === '\n')
            $result .= "<br>";
    }
    return $result;
}*/

$song = $_GET['data'];//   Artist\Album\Song
$curbspos = 0;
$artist = substr($song, 0, $curbspos = strpos($song, "\\"));
$song = substr($song, $curbspos+1, strlen($song)-$curbspos);
$album = substr($song, 0, $curbspos = strpos($song, "\\"));
$song = substr($song, $curbspos+1, strlen($song)-$curbspos);

//echo $artist ." ". $album ." ". $song;

$azurl = GoogleSearchForLyrics($artist, $song, "https://www.azlyrics.com");
header('Content-Type: text/plain');
echo ExecuteAZLyrics($azurl);
//echo $azurl;

//$path = $artist . "/" . $album;
//if (!file_exists($path)) {
//    mkdir($path, 0777, true);
//}
//$path .= "/" . $song;


//if (file_exists($path)) {
    //echo file_get_contents($path);
//}
//else{
    //$azurl = GoogleSearchForLyrics($artist, $song, "https://genius.com");
    //echo $azurl;
    //echo ExecuteGeniusLyrics($azurl, $path);
    //echo file_get_contents($path);
//}




?>