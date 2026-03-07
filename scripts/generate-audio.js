#!/usr/bin/env node
// Generate narration audio files via ElevenLabs TTS API.
// Usage: ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... node scripts/generate-audio.js

var https = require('https');
var fs = require('fs');
var path = require('path');

var API_KEY = process.env.ELEVENLABS_API_KEY;
var VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

if (!API_KEY || !VOICE_ID) {
  console.error('Error: Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID environment variables.');
  process.exit(1);
}

var OUTPUT_DIR = path.join(__dirname, '..', 'audio');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

var chapters = [
  {
    id: '01-iteration',
    text: "Take any number. Square it and add a constant. Take the result, square it, add the same constant. Repeat — forever. This absurdly simple rule is the seed of infinite complexity. What you see before you is the Mandelbrot set: a map of every possible constant c in the complex plane, colored by what happens when you iterate z squared plus c from zero. Black points stay bounded — their orbits never escape. Colored points flee to infinity, and the color tells you how quickly they leave. The boundary between bounded and unbounded is infinitely intricate — zoom in anywhere along it and you'll find spirals, tendrils, and miniature copies of the whole set, repeating at every scale. This is the fingerprint of chaos: simple rules producing structure so rich that no amount of magnification ever exhausts it."
  },
  {
    id: '02-mandelbrot',
    text: "The main body of the Mandelbrot set is a perfect cardioid — a heart-shaped curve from analytic geometry. Attached to it is the period-two bulb, a perfect circle, where orbits bounce between two values forever. Along the boundary, smaller bulbs sprout in a precise pattern governed by Farey arithmetic and the Fibonacci sequence. Between the cardioid and the period-two bulb lies Seahorse Valley — zoom in and you find an explosion of double spirals, each arm containing miniature copies of the full set. On the opposite side, Elephant Valley unfurls trunk-like tendrils. Every bulb corresponds to a periodic orbit. The period-three bulb sits at the tip of one of the largest antenna filaments. Sharkovskii's theorem tells us that period three implies chaos — meaning that near any period-three orbit, orbits of every other period also exist. The Mandelbrot set is not just a pretty picture. It is a complete catalog of dynamical behavior for the family z squared plus c. Every qualitative change in dynamics — every bifurcation, every transition from order to chaos — is encoded in this single image."
  },
  {
    id: '03-julia',
    text: "Every single point in the Mandelbrot set has a twin — a Julia set. Fix the constant c and let the starting point z vary across the complex plane. If c lies inside the Mandelbrot set, its Julia set is a connected, single piece. If c lies outside, the Julia set shatters into Cantor dust — infinitely many disconnected points. This is the Fatou-Julia theorem, and it gives the Mandelbrot set its deepest meaning: it is the map of connectivity for Julia sets. Watch the Julia preview as we trace along the Mandelbrot boundary. Near the cusp of the cardioid, Julia sets look like pinched circles. Near the period-two bulb, they resemble the Douady rabbit with three ears. At the Misiurewicz points — where the boundary is sharpest — Julia sets become dendrites, tree-like structures with no interior at all. Gaston Julia and Pierre Fatou described these sets in 1918, decades before computers could visualize them. They worked entirely from formal analysis, proving theorems about objects they could never see. When Benoit Mandelbrot finally rendered them in 1979, the mathematical world was stunned by their beauty."
  },
  {
    id: '04-zoo',
    text: "The Mandelbrot set is just one species in a vast menagerie of fractals. The Burning Ship fractal uses the same iteration rule but takes the absolute value of the real and imaginary parts before squaring. This tiny asymmetry shatters the rotational symmetry, creating a shape that eerily resembles a burning galleon. Zoom into its main antenna and you find structures unlike anything in the Mandelbrot set — jagged, aggressive, and deeply alien. Newton's method fractal reveals something different entirely. Apply Newton's root-finding algorithm to z cubed minus one, and the complex plane partitions into three basins of attraction — one for each cube root of unity. The boundaries between these basins form a fractal of extraordinary delicacy. Every boundary point is simultaneously on the boundary of all three basins — a topological property called Wada boundaries that defies everyday intuition. These fractals share a common ancestor: the theory of holomorphic dynamics developed by Julia, Fatou, Mandelbrot, Douady, and Hubbard. Every rational function on the complex plane produces its own fractal partition, each a unique window into the interplay of attraction and repulsion."
  },
  {
    id: '05-chaos',
    text: "What connects all of this is chaos theory — the study of systems where simple deterministic rules produce behavior so complex it appears random. Edward Lorenz discovered this in 1963 while modeling weather: tiny rounding errors in initial conditions led to completely different forecasts. He called it the butterfly effect. The Mandelbrot set is the purest visual expression of this principle. Two points separated by a billionth of a pixel can have completely different fates — one bounded forever, the other escaping in ten iterations. That hypersensitivity to initial conditions is the mathematical definition of chaos. And yet chaos is not randomness. It has structure. The Feigenbaum constants — 4.669 and 2.502 — appear universally in the transition from order to chaos, whether you're studying dripping faucets, population models, electronic circuits, or these fractals. Mitchell Feigenbaum discovered that every route to chaos follows the same scaling law, a universality as profound as anything in physics. Fractals are not just mathematics. They are nature's geometry — the shape of coastlines, clouds, blood vessels, lightning, galaxies. Mandelbrot called them the geometry of nature, and he was right. The boundary of the Mandelbrot set, with its infinite complexity emerging from z squared plus c, is a reminder that the universe runs on simple rules — and those rules are capable of generating everything we see."
  }
];

function generateChapter(index) {
  if (index >= chapters.length) {
    console.log('\nAll chapters generated successfully.');
    return;
  }

  var chapter = chapters[index];
  var outFile = path.join(OUTPUT_DIR, chapter.id + '.mp3');
  console.log('Generating ' + chapter.id + '...');

  var postData = JSON.stringify({
    text: chapter.text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true
    }
  });

  var options = {
    hostname: 'api.elevenlabs.io',
    port: 443,
    path: '/v1/text-to-speech/' + VOICE_ID,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY,
      'Accept': 'audio/mpeg'
    }
  };

  var req = https.request(options, function(res) {
    if (res.statusCode !== 200) {
      var body = '';
      res.on('data', function(d) { body += d; });
      res.on('end', function() {
        console.error('  Error ' + res.statusCode + ' for ' + chapter.id + ': ' + body);
        generateChapter(index + 1);
      });
      return;
    }

    var file = fs.createWriteStream(outFile);
    res.pipe(file);
    file.on('finish', function() {
      file.close();
      var size = fs.statSync(outFile).size;
      console.log('  Saved ' + outFile + ' (' + Math.round(size / 1024) + ' KB)');
      setTimeout(function() { generateChapter(index + 1); }, 1000);
    });
  });

  req.on('error', function(e) {
    console.error('  Request error for ' + chapter.id + ': ' + e.message);
    generateChapter(index + 1);
  });

  req.write(postData);
  req.end();
}

console.log('ElevenLabs TTS Audio Generator — Fractals & Chaos');
console.log('Voice ID: ' + VOICE_ID);
console.log('Output: ' + OUTPUT_DIR);
console.log('---');
generateChapter(0);
