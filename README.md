# 3DWayfinderNGTemplate
Free to use 3D Wayfinder Front End template (AngularJS)

## Getting Started

If You're on default linux conf then run:
<pre>
sudo npm install -g bower gulp
</pre>
 
If You've set up node to run WITHOUT <i>sudo</i> then run:
<pre>
npm install -g bower gulp
</pre>

After bower and gulp have been installed run the following:
<pre>
(sudo if needed) npm install
bower install
</pre>

After all the dependencies have been install You can build the project with:
<pre>
gulp
</pre>

If You want to also try out the project with Your default web-browser then run:
<pre>
gulp watch-bs
</pre>
This will start <i>browser-sync</i> on <i>localhost:8080</i> and automatically launch Your default web browser with this address.
<p>
To build the project in production mode run:
<pre>
gulp production
</pre>

This will remove all comments and <i>console</i>'s from the app.