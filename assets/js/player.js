var song;
var myname;
var name;
var vidId;
var sear;
var nextArtist;
var lastfmauth = false;
var my = '';
var api_key = '';
var lovedSongsArray = new Array();
var topTracksArray = new Array();

//event on forward button
$('.forward').click(function(event) {
    whenSongFinish();
  })

  //onclick delete button event
$('.nextsongs').on('click', 'img.deletesong', function(e) {
    e.preventDefault();
    $(this).parent().fadeOut('400', function() {
      $(this).remove();
    });
  })
  //add song to playlist
$('.nextsongs').on('click', 'img.queusong', function(event) {
  event.preventDefault();
  song = $(this).parent().text();
  $(this).parent().fadeOut('400', function() {
    $(this).remove();
  })
  fillQueuList(song);
})

//onclick play button event play this song
$('.nextsongs').on('click', 'img.play', function(event) {
  event.preventDefault();
  sear = $(this).parent().text();
  $(this).parent().fadeOut('400', function() {
    $(this).remove();
  })
  Youtubesearch(sear);
  setTimeout(function() {
    player.loadVideoById(vidId)
      //   player.cueVideoById(vidId);
      //       player.nextVideo();
      //      player.playVideo();
      //
  }, 1900);
  $('.nombresonando').html(sear);
})

//get friends of clicked friend
$('.favoritescontainer').on('click', '#getfriends', function(event) {
  name = $(this).data('name');
  getFriends(name);
})

//get user most listened tracks,fill search list and display search list
$('.favoritescontainer').on('click', '#gettoptracks', function(event) {
  event.preventDefault();
  $('.nextsongsearch').remove();
  newname = $(this).data('name');
  jQuery.get('http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&format=json', {
      api_key: api_key,
      user: newname,
      limit: 100,
    },

    function(data, textStatus, xhr) {
      console.log(data);
      $.each(data.toptracks, function(key, data) {
        $.each(data, function(index, data) {
          toptracksresponse = data.artist.name + '-' + data.name;
          // topTracksArray.push(lovedtracksresponse);
          fillSearchList(toptracksresponse);
        })
      })
    })
  $('#favorites').hide();
  $('#searchresults').show();
})

//get target friends loved songs on click and fill search list
$('.favoritescontainer').on('click', '#friendlovedsongs', function(event) {
  event.preventDefault();
  $('.nextsongsearch').remove();
  newname = $(this).data('name');
  loadLovedSongs(newname);
  $('body').addClass("loading");
  setTimeout(function() {
    for (var i = 0; i < lovedSongsArray.length; i++) {
      // Add additional code here, such as:
      console.log(lovedSongsArray[i]);
      fillSearchList(lovedSongsArray[i]);
    }
    console.log(lovedSongsArray);
    $('#favorites').hide();
    $('body').removeClass("loading");
    $('#searchresults').show();
  }, 9500)
})
//Search  song and queu it
$('.search').keypress(function(e) {
  var key = e.which;
  if (key == 13) // the enter key code
  {
    song = $('.search').val();
    fillQueuList(song);
    $(this).val('');
    $('section:visible').hide();
    $('#next').show();

  }
});

// //Display the content of tabs
// $('  ul.tabs > li').click(function(event) {
//   //get displaying tab content jQuery selector
//   var active_tab_selector = $('ul.tabs > li.active > a').attr('href');
//   //hide displaying tab content
//   $(active_tab_selector).removeClass('active');
//   $(active_tab_selector).addClass('hide');
//   //find actived navigation and remove 'active' css
//   var actived_nav = $(' ul.tabs > li.active');
//   actived_nav.removeClass('active');
//   //add 'active' css into clicked navigation
//   $(this).parents('li').addClass('active');
//   var target_tab_selector = $(this).attr('href');
//   $(target_tab_selector).removeClass('hide');
//   $(target_tab_selector).addClass('active');
// })

//event to like and dislike songs in history list
$('.historycontent').on('click', '.likehistory', function(event) {
  event.preventDefault();
  if ($('.like').attr('src') === 'assets/images/heart.png') {
    loveSong();
    $(this).attr("src", "assets/images/like.png");
  } else {
    unLoveSong();
    $(this).attr("src", "assets/images/heart.png");
  }
})

//Event to like and dislike songs
$('.like').click(function(event) {
  event.preventDefault();
  console.log(this);
  if ($('.like').attr('src') === 'assets/images/heart.png') {
    loveSong();
    $(this).attr("src", "assets/images/like.png");
  } else {
    unLoveSong();
    $(this).attr("src", "assets/images/heart.png");
  }
});

//like and dislike songs in history list
$('.historycontent').on('click', '.likehistory', function(event) {})

//loads user lastfm loved songs
function getLovedSongs() {
  songlist = sessionStorage.getItem(myname);
  songlist.split('","').forEach(function(song) {
    fillSearchList(song);
  });
}

//check if the current song is in the users loved songs
function isLoved(element) {
  canciones = sessionStorage.getItem(myname);
  song = encode_utf8(sear.match(/-(.*)/g)[0].match(/[^-](.*)/)[0]);
  if (canciones.includes($.trim(song))) {
    $(element).attr("src", "assets/images/like.png");
  } else {
    $(element).attr("src", "assets/images/heart.png");
  }
}



//load loved songs an stores  them on  lovedSongsArray
function loadLovedSongs(name) {
  var totalLovedSongs;
  lovedSongsArray.length = 0;
  jQuery.get('http://ws.audioscrobbler.com/2.0/?method=user.getLovedTracks', {
    user: name,
    api_key: api_key,
    format: 'json',
    limit: 1,
  }, function(data, textStatus, xhr) {
    totalLovedSongs = data.lovedtracks['@attr'].total;
    if (totalLovedSongs == '0') {
      sweetAlert(name + " didn't love any song");
    }
    jQuery.get('http://ws.audioscrobbler.com/2.0/?method=user.getLovedTracks', {
        user: name,
        api_key: api_key,
        format: 'json',
        limit: totalLovedSongs,
      },
      function(data, textStatus, xhr) {
        lovedtracksobject = data;
        $.each(data.lovedtracks, function(key, data) {
          $.each(data, function(index, data) {
            lovedtracksresponse = data.artist.name + '-' + data.name;
            // lovedSongsArray.push(lovedtracksresponse);
            fillSearchList(lovedtracksresponse);
          })
        });
      });
  });
}

//encode  string to utf8
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}
//get UNIX timestamp in seconds
function seconds_since_epoch() {
  return Math.floor(Date.now() / 1000)
}

//send  songs to  queu list
function fillQueuList(song) {
  $('.nextsongscontent').append('<li class="nextsong" id="nextsongname"><div class="nombre">' + song + '</div><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-play-128.png"  class="play" alt="">' +
    '<img src="https://cdn2.iconfinder.com/data/icons/interface-line-set/24/icn-trash-bin-128.png" class="deletesong" alt=""></li>');
}
//send songs to history
function fillHistoryList() {
  canciones = sessionStorage.getItem(myname);
  song = encode_utf8(sear.match(/-(.*)/g)[0].match(/[^-](.*)/)[0]);
  if (canciones.includes($.trim(song))) {
    $('.historycontent').append('<li class="nextsong"> <div class="nombre">' + sear + '</div><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-play-128.png"  class="play" alt="">' +
      '<img src="assets/images/like.png" class="likehistory" alt=""></li>');
  } else {
    $('.historycontent').append('<li class="nextsong"> <div class="nombre">' + sear + '</div><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-play-128.png"  class="play" alt="">' +
      '<img src="assets/images/heart.png" class="likehistory" alt=""></li>');
  }

  if (!lastfmauth) {
    $('.likehistory').remove();
  }
}
//send song to search list
function fillSearchList(song) {
  $('.searchresultscontent').append('<li class="nextsong nextsongsearch"> <div class="nombre">' + song + '</div><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-play-128.png"  class="play" alt="">' +
    '<img src="assets/images/add.png" class="queusong" alt=""></li>');
}



//hash string to MD5
function toMD5(b) {
  return CryptoJS.MD5(b).toString();
}

$('ul.tabs').each(function() {
  // For each set of tabs, we want to keep track of
  // which tab is active and its associated content
  var $active, $content, $links = $(this).find('a');

  // If the location.hash matches one of the links, use that as the active tab.
  // If no match is found, use the first link as the initial active tab.
  $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
  $active.addClass('active');

  $content = $($active[0].hash);

  // Hide the remaining content
  $links.not($active).each(function() {
    $(this.hash).hide();
  });

  // Bind the click event handler
  $(this).on('click', 'a', function(e) {
    // Make the old tab inactive.
    $active.removeClass('active');
    $content.hide();

    // Update the variables with the new link and content
    $active = $(this);
    $content = $(this.hash);

    // Make the tab active.
    $active.addClass('active');
    $content.show();

    // Prevent the anchor's default click action
    e.preventDefault();
  });
});
//Get parameters from url's query string
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//whatch if next songs list empty and determines what to do
function whenSongFinish() {
  if ($('#nextsongname').size() == 0) {
    lastSearch();
  } else {
    playQueudSong();
  }
}
//get user top tracks
function getUserTopTracks(api_key, name) {
  jQuery.get('http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&format=json', {
      api_key: api_key,
      user: name,
      limit: 5,
    },

    function(data, textStatus, xhr) {
      var rand = Math.floor(Math.random() * (5 - 0 + 0)) + 0;;
      sear = data.toptracks.track[rand].artist.name + '-' + data.toptracks.track[rand].name;
    })
};

//love lastfm song
function loveSong() {

  var artist = encode_utf8(sear.match(/.*?(?=-|$)/)[0]);
  var song = encode_utf8(sear.match(/-(.*)/g)[0].match(/[^-](.*)/)[0]);
  var sign = 'api_key' + api_key + 'artist' + artist + 'methodtrack.lovesk' + key + 'track' + song + my;
  var lastcall = toMD5(sign);
  jQuery.post('https://ws.audioscrobbler.com/2.0/', {
      track: song,
      artist: artist,
      api_sig: lastcall,
      method: 'track.love',
      api_key: api_key,
      sk: key,
    },
    function(data, textStatus, xhr) {});
}

//unlove song in lastfm
function unLoveSong() {
  var artist = encode_utf8(sear.match(/.*?(?=-|$)/)[0]);
  var song = encode_utf8(sear.match(/-(.*)/g)[0].match(/[^-](.*)/)[0]);
  var sign = 'api_key' + api_key + 'artist' + artist + 'methodtrack.unlovesk' + key + 'track' + song + my;
  var lastcall = toMD5(sign);

  jQuery.post('https://ws.audioscrobbler.com/2.0/', {
      track: song,
      artist: artist,
      api_sig: lastcall,
      method: 'track.unlove',
      api_key: api_key,
      sk: key,
    },
    function(data, textStatus, xhr) {});
}


//Get session in last.fm
function getLFMsession() {
  var token = getParameterByName('token');
  //get lastfm api_sig
  var c = 'api_key' + api_key + 'methodauth.getSessiontoken' + token + my;
  var b = toMD5(c);

  jQuery.get('http://ws.audioscrobbler.com/2.0/?method=auth.getSession', {
      token: token,
      api_key: api_key,
      api_sig: b,
    },

    function(data, textStatus, xhr) {

      var xmlDoc = $.parseXML(xhr.responseText);
      var xml = $(xmlDoc);
      console.log(data);
      var xmlname = xml.find('name')
      var prekey = xml.find('key');
      myname = xmlname[0].textContent;
      key = prekey[0].textContent;
      lastfmauth = true;
      $('.islogged').html('Hi ! ' + myname);
    })
};
//Search  song in youtube
function Youtubesearch(sear) {
  jQuery.get('https://www.googleapis.com/youtube/v3/search', {
      part: "snippet",
      q: sear,
      key: "",
      limit: 1,
      type: 'video',
    },
    function(data, textStatus, xhr) {
      if (data.items.length == 0) {
        sweetAlert('Youtube cannot find ' + sear + ' song.Please restart radiotube');
      }
      //player.cueVideoById(vidId);
      vidId = data.items[0].id.videoId;
    })
}

//Page entry point

if (getParameterByName('song') == null) {

  $('body').addClass("loading");
  getLFMsession();
  setTimeout(function() {
    getUserTopTracks(api_key, myname);
  }, 700)
  setTimeout(function() {
    loadLovedSongs(myname);
  }, 1001);
  setTimeout(function() {
    $('.nombresonando').html(sear);
    Youtubesearch(sear);
    // ytLoad();
    getFriends(myname);
  }, 3700);
  setTimeout(function() {
    $('body').removeClass("loading");

    sessionStorage.setItem(myname, JSON.stringify(lovedSongsArray));
  }, 9100)
} else {
  sear = getParameterByName('song');
  $('.nombresonando').html(sear);
  Youtubesearch(sear);
  $('li#tabthree,  li#tabfour , img.like').hide();
}
setTimeout(function() {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}, 6900);



var player;

function onYouTubePlayerAPIReady() {
  if (sear == undefined) {
    sweetAlert('Radiotube could not launch.Please retry');;
  }
  player = new YT.Player('player', {
    videoId: vidId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onError
    }
  });

}
// }

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.


function onError(event) {
  if (event.data === 2) {
    sweetAlert('Radiotube could not connect with Youtube.Please go back to main page ');
  } else if (event.data === 150) {
    sweetAlert('This song can be played outside youtube');
  }

}
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
  if (event.data === 0) {
    whenSongFinish();
    if (lastfmauth == true) {
      scrobble();
    }
  }
  if (event.data === -1) {
    fillHistoryList();
    if (lastfmauth == true) {
      isLoved('.like');

    }
  }
}

function stopVideo() {
  player.stopVideo();
}

function song(string) {
  return sear.match(/-(.*)/g)[0].match(/[^-](.*)/)[0]
}

function artist(string) {
  return sear.match(/.*?(?=-|$)/i)[0];
}
//search related song in last fm
function lastSearch() {
  var artist = encode_utf8(sear.match(/.*?(?=-|$)/)[0]).trim();
  jQuery.get('http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&api_key=d80a643305a686c9010a5595bb2028ac&format=json', {
      artist: artist,
      limit: 5,
    },
    function(data, textStatus, xhr) {
      if (data.error == '6') {
        sweetAlert('Cannot continue playing-Search a new song');
      } else {
        var index = Math.floor(Math.random() * (4 - 0 + 0)) + 0;;
        var nextArtist = data.similarartists.artist[index].name;
        jQuery.get('http://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&api_key=d80a643305a686c9010a5595bb2028ac&format=json', {
            artist: nextArtist,
            limit: 5
          },
          function(data, textStatus, xhr) {
            if (data.toptracks == null) {
              sear = 'Camaron-Soy gitano';
            }
            var index = Math.floor(Math.random() * (4 - 0 + 0)) + 0;;
            var topTrack = data.toptracks.track[index].name;
            sear = nextArtist + '-' + topTrack;
            console.log(sear);
            Youtubesearch(sear);
            setTimeout(function() {
              player.loadVideoById(vidId);
              $('.nombresonando').html(sear);
            }, 1500);
          });
      }
    }
  )
}


//get friends of target name
function getFriends(name) {
  $('ul#friends').remove();
  $.post('http://ws.audioscrobbler.com/2.0/?method=user.getfriends', {
      api_key: api_key,
      user: name,
      format: 'json'
    },
    function(data, textStatus, xhr) {
      for (var i in data.friends.user) {
        var avatar = data.friends.user[i].image[1]["#text"];
        var friends = data.friends.user[i].name;
        if (avatar !== "") {
          $('.favoritescontainer').append('<ul id="friends"> <li><a target="_blank" href="http://last.fm/user/' + friends + '"><input type="image"  class="avatar" src="' + avatar + '"/></a> <ul class="dropdown"> <li>' + friends + '</li> <li id="friendlovedsongs" data-name="' + friends + '"><a href="#">Loved Songs</a></li> <li id="getfriends"  data-name="' + friends + '"><a href="#">Friends</a></li><li id="gettoptracks" data-name="' + friends + '"><a href="#">Top Tracks</a></li></ul> </li> </ul>');
        }
      }
    });
}


//play queud song
function playQueudSong(argument) {
  sear = $('#nextsongname').first().text();
  Youtubesearch(sear);
  $('#nextsongname').fadeOut('400', function() {
    $('#nextsongname').first().remove();
  })
  setTimeout(function() {
    player.loadVideoById(vidId);
    $('.nombresonando').html(sear);

  }, 2000);
}
//scrobbles  song
function scrobble() {

  var artist = encode_utf8(sear.match(/.*?(?=-|$)/)[0]);
  var song = encode_utf8(sear.match(/-(.*)/g)[0].match(/[^-](.*)/)[0]);
  var timestamp = seconds_since_epoch();
  var sign = 'api_key' + api_key + 'artist' + artist + 'methodtrack.scrobblesk' + key + 'timestamp' + timestamp + 'track' + song + my;
  var lastcall = toMD5(sign);

  jQuery.post("https://ws.audioscrobbler.com/2.0/",
    //?method=track.scrobble&artist="+artist+"&track="+song+"&timestamp="+timestamp+"&api_key=d80a643305a686c9010a5595bb2028ac&api_sig="+lastcall+"&sk="+key,
    {
      artist: artist,
      track: song,
      timestamp: timestamp,
      api_key: api_key,
      api_sig: lastcall,
      method: 'track.scrobble',
      sk: key,
    },
    function(data, textStatus, xhr) {})
};



$("#ul-menu-list li").click(function() {
  $('.box').hide().eq($(this).index()).show();
});

//https://github.com/RubaXa/Sortable  drag and drop list items
Sortable.create(nextsongs, {});
