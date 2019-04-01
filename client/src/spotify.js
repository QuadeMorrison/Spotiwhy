import SpotifyWebApi from 'spotify-web-api-js';

export const spotifyApi = new SpotifyWebApi();

Object.byString = function(o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

// https://stackoverflow.com/questions/8273047/javascript-function-similar-to-python-range
function range(start, stop, step) {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step == 'undefined') {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
};

export const getTracks = limit => {
  let offsets = range(0, limit, 50)
    .map(off => spotifyApi.getMySavedTracks({off, limit: 50}))

  return Promise.all(offsets).then(data => {
    return data.map(d => d.items).flat()
  })
}

export const chunkTracks = (tracks, variable, chunkSize = 100) => {
  const ids = tracks.map(t => Object.byString(t, `track.${variable}`))
  let chunks = []

  for (let i = 0; i <= ids.length; i += chunkSize)
    chunks.push([ids.slice(i, i + chunkSize)])

  return chunks
}

const getAudioFeatures = (tracks) => {
  const ids = chunkTracks(tracks, "id")
    .map(chunk => spotifyApi.getAudioFeaturesForTracks(chunk))

  return Promise.all(ids).then(data => {
    return data.map(d => d.audio_features).flat()
  })
}

export const getAlbumGenres = (tracks) => {
  const ids = chunkTracks(tracks, "artists[0].id", 20)
    .map(chunk => spotifyApi.getArtists(chunk))

  return Promise.all(ids).then(data => {
    return data.map(d => d.artists).flat().map(a => a.genres)
  })

}

export const getTrackDetails = (tracks) => {
  return tracks.map(t => {
    return {
      added_on: t.added_at,
      album: t.track.album.name,
      artist: t.track.artists[0].name,
      duration_ms: t.track.duration_ms,
      name: t.track.name,
      popularity: t.track.popularity
    }
  })
}

export const getDataset = () => {
  return getTracks(150).then(tracks => {
    let details = getTrackDetails(tracks)
    let auF = getAudioFeatures(tracks)
    let alG = getAlbumGenres(tracks)
    return Promise.all([auF, alG]).then(data => {
      return data[0].map((f, i) => {
        let genres = { genres: data[1][i] }
        return Object.assign(f, genres, details[i])
      })
    })
  })
}

export const asCsv = (items) => {
  if (items.length > 0) {
    const replacer = (key, value) => value === null ? '' : value
    const header = Object.keys(items[0])
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    return csv.join('\r\n')
  }

  return ""
}
