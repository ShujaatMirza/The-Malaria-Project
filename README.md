# The-Malaria-Project

Wait, we still have Malaria in the 21st century?! is essentially an interactive graph that lets a user visualize the number of Malaria cases reported across the globe in recent years. The purpose of the application is to spread awareness regarding this persisting disease and to create a better user experience for the parties interested in working with such data. I am using this blog to explain how I came up with this idea and what technical difficulties I encountered while completing the project.

The idea first originated into my mind over the summer while I was researching in Professor Kourosh’s lab on the creation of mosquito trap using synthetic biology. While we found a lot of data online, I did not come across an interactive, easy-to-navigate graph displaying the trend in the number of cases reported. This is why I decided to make 'Wait, we still have Malaria in the 21st century?!' my second project for the Mashups Class taught here at NYUAD by Professor Craig.

I fetched the data from World Health Organizations (WHO) website regarding the number of Malaria cases reported annually across the globe during the recent fourteen years. In order to create dynamic, interactive data visualizations in web browsers, I used the JavaScript’s D3.js library.

I utilized the GeoJSON along with D3’s Geo projections to encode the geographic data structures with polygon geometry type. I used the code written by Mike Bostock for zoom in functionality once a country has been clicked on the map. On mouseout and mouseover events, the application uses the d3-tip’s methods to display or hide the tooltip. The highest and lowest dataset is extracted from the database and is used to create a quantile scale and then I used the colorbrewer.js to give the legend different colors based on the data.

I laid special emphasis on the design and styling of the application. Based on different types of reviews I received from users, I decided to keep both arrow keys and the link to all years in order to cycle through years. The application also contains an auto play option that changes years without user’s input periodically to better display the trend.

The main challenge that I faced in the development phase was the simultaneous working of different options such as zoom in, auto play and updating of the data in the tooltip. So I had to carefully design what goes into the Update function and what does not. One such situation is that auto play function stops when a user clicks a year while in auto play mode and displays the data specific to user’s selection.

Moving on, I believe there is still a room for improvement in the project. One such improvement could be to create my own scale of colors to better represents the data and minimizes the effect of an outlier in the data, i.e. high number of cases reported in Democratic Republic of the Congo. If you have any feedback, kindly feel free to reach out to me at muhammad.mirza@nyu.edu. 
