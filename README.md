## Inspiration
My first motivation was to learn meteor; create a second application. My first application is an attempt to recreate billpin which seems to be going into decay, I've publish this first app a while ago at: http://billbuz.com/.

Internet of Things have been a popular topic lately and we are seeing many applications being create to monitor data streams. Since I've always been a fan of home automation and as a side hobby I build my wireless arduino sensors, I wanted to be able to track them in a convenient way. I have few Arduino with nRF24L01 and sensors which are battery powered around the house.

## What it does
I have few Arduino with wireless nRF24L01 which communicate using the NRF24Mesh libray (which allow routing the data through other mesh nodes) to a mesh server currently running on a Raspberry Pi. This RPI communicate to the Meteor server using C++/DDP to feed the data from all its sensors on the mesh network. 

Where the hackathon come in is for the the meteor part. The meteor server listen for devices feed from DDP protocol. Those feed come from any source as long as they respect the app high level RPC protocol. Then it store information about the sensors into mongo which allows clients to visualize it. It manage user sessions to allow modifying the feeds metadata that your user own.

We use the userId and private key on external applications or RPI to feed the data. This is required in order to have a user owning the feed.

On the client side we can see the sensors and it's data in charts. All chars are update realtime from the sensors data. Only a subset of the data is sent to the client to minimize the transfert between the server and client. For instance, when activating a feed, a subscription is made for that particular feed and providing the last X element of the collection.

## How I built it
In this hackathon I've worked only on the meteor part so I'll skip the C++ DDP impl and RPI/arduino communication.

To prevent from having to build everything from scratch, I've used as many packages as I could that would save me some time.

To quickly create the UI, I've looked around at other web site source HTML and CSS to "inspire" my design from them. To create the picture on the login page, I've took a picture of the RPI with an Adruino.

I've done the routing with iron:router and read the tutorial which explains how to wait for data to be fully loaded before changing page, and also to have a loading screen while the initial first load.

Chartist-js is an excellent chart package to visualize the data. It's been very easy to integrate.

Many thanks to the Meteor Toys which accelerated my development a lot. For sure I'm going to buy it.

## Challenges I ran into
I'm a beginer on Meteor, I've only published one app with this framework. Also, I'm not a web programmer in my full time job, I work as a game programmer on PC and console games. This lead me to time loss such as  re-reading some basic meteor stuff such as the rounting part using iron:router. Simply having a correct Html/Css layout took some precious time.

Also since my artistic talent leaves much to be desired, I could not create my own textures. I had to find free textures online but ran into packages to help me such as bootstrap & FontAwesome. While designing the second page where we see graph, I lost time trying to figure out how to show the data and what I actually wanted as a final result.

The usual issue, I wanted to do more than I could so I ended up with a partial application and no sleep in that 24 hour.

At some point I had issue between the RPI communicating with the meteor server. I didn't want to spent time on that part in the hackathon but I had to in order to have working feeds.

## Accomplishments that I'm proud of
I managed to get the data from my Arduino sensors, to my RPI, then to my meteor server and show the sensor feeds into charts. I wasn't sure I could get there in time, but my best friend google helped me out a lot to learn the pieces I was missing on meteor/javascript/etc.

Also I load only the feed data on demand so there is not a huge initial transfer.

I'm not too sad about the look of the app, the login screen look good, and the feed screen is okay. Lacking functionality though.

## What I learned
With meteor I can deliver prototypes very quickly. I don't see how I would have done it using any other framework.

I've also learn some meteor basics which i didn't assimilate completly while doing my first app.

## What's next for CloudIoT
I want to tweak sensors variables from the meteor web interface. It's tedious to modify the code and reupload it to aduinos each time I want to try a new values.

I want to have only the owner who can see its feed. He could then share a view or a feed with someone else as he wants.

I would like to have a more customizable dashboard, we decide which feed to see and in which graph we'll visualize the data.

I would also like to have alert based on certain data values, and send email of sms depending on preferences.

Adding a new client to feed data is not user friendly right now, I want to have this part made easier.

## Packages Used
- meteor-platform
- mfpierre:chartist-js
- mrt:bootstrap-3
- accounts-base
- accounts-password
- ian:accounts-ui-bootstrap-3
- anti:i18n
- iron:router
- pfafman:font-awesome-4
- meteortoys:allthings