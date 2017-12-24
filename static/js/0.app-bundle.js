webpackJsonp([0],{180:function(e,t,r){"use strict";function a(e){return{seasons:e.seasons}}function n(e){return{mainentity:e.mainentity,loading:e.loading}}function o(e){return{mainentity:e.mainentity,loading:e.loading}}Object.defineProperty(t,"__esModule",{value:!0}),t.ASeasonPrimaryView=t.SeasonPrimaryView=t.SeasonList=void 0;var i=r(92),s=r(291),u=function(e){return e&&e.__esModule?e:{default:e}}(s),p=r(91),l=r(741);t.SeasonList=(0,i.connect)(a)((0,u.default)(l.SeasonList,{fetcher:"fetchSeasons",success:p.actionTypes.SEASONS_FETCHED})),t.SeasonPrimaryView=(0,i.connect)(n)((0,u.default)(l.SeasonPrimaryView,{fetcher:"fetchSeason",success:p.actionTypes.SEASON_FETCHED})),t.ASeasonPrimaryView=(0,i.connect)(o)((0,u.default)(l.ASeasonPrimaryView,{fetcher:"fetchASeason",success:p.actionTypes.ASEASON_FETCHED}))},730:function(e,t,r){"use strict";function a(e){return n[e]||"#ccc"}Object.defineProperty(t,"__esModule",{value:!0}),t.genreColor=a;var n=(t.STYLES={titleChart:{backgroundColor:"#009687",color:"white",fontVariant:"small-caps",fontSize:"35px",fontWeight:"bold",justifyContent:"center"}},t.GENRE_COLORS={"comédie":"#ff7f0e","tragédie":"#1f77b4","comedie-ballet":"#ffbb78",drame:"#17becf",autre:"#e377c2",null:"#f7b6d2"})},733:function(e,t,r){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function s(e){var t=(e.getMonth()+1)%12,r=0===t?e.getFullYear()+1:e.getFullYear();return new Date(r,t,1,12)}function u(e){return(e.getDay()+6)%7}function p(e,t){return Math.floor((Number(e)-Number(t))/864e5)}function l(e,t){function r(e){var t=["calendar-day"];return e.inrange||t.push("calendar-empty-cell"),e.free?t.push("calendar-free"):e.highrate&&t.push("calendar-highrate"),t.join(" ")}function a(e){var t=e.register;if(t){d3.select(this).style("cursor","pointer").style("stroke-width","2").style("stroke-opacity","0.8").style("stroke","black"),C.style("visibility","visible");var r=t.plays.map(function(e){return"<li>"+e.play_title+" / "+e.author_name+"</li>"}),a="\n"+(0,_.dateFormatter)(t.date)+"<br/>\nRecettes: "+t.receipts+" livres\n<ul>\n"+r+"\n</ul>\n";C.transition().duration(200).style("opacity",.9),C.html(a).style("left",d3.event.pageX+30+"px").style("top",d3.event.pageY+"px")}}function n(e){e.register&&(d3.select(this).style("cursor","default").style("stroke-width","0"),o())}function o(){for(C.transition().duration(500).style("opacity",0);C.firstChild;)C.removeChild(C.firstChild)}var l=new Date(e[0].date),d=new Date(e[e.length-1].date),c={};e.forEach(function(e){c[(0,_.dateFormatter)(new Date(e.date))]=e});var f=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"],m=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],b=new Date(l.getFullYear(),l.getMonth(),1),R=s(d),g=d3.time.days(b,R).map(function(e){e=new Date(e);var t={date:e,weekday:u(e)};return e<l||e>d?(t.receipts=0,t.inrange=!1):(t.register=c[(0,_.dateFormatter)(e)],t.receipts=t.register?t.register.receipts:0,t.inrange=!0),t}),k=Math.min.apply(Math,i(e.map(function(e){return e.receipts}))),v=Math.max.apply(Math,i(e.map(function(e){return e.receipts}))),E=Math.floor(g.length/7)+2,x=20*E+100+10+40,S=d3.scale.linear().domain([k,v]).interpolate(d3.interpolateHcl).range([d3.rgb("#FFF3BB"),d3.rgb("#8e0000")]),w=d3.select(t).selectAll("svg").data(d3.range(l.getFullYear(),l.getFullYear()+1)).enter().append("svg").attr("width",x).attr("height",200),C=document.querySelector("#scalendar-tooltip");C=null===C?d3.select("body").append("div").attr("id","scalendar-tooltip").style("position","absolute").style("z-index","10").style("border","1px solid black").style("background-color","#fff").style("visibility","hidden"):d3.select(C),w.selectAll(".calendar-daylabel").data(f).enter().append("text").text(function(e){return e}).attr("x",120).attr("y",function(e,t){return 50+20*t}).attr("class","calendar-daylabel").style("text-anchor","end"),w.selectAll(".calendar-monthlabel").data(d3.time.months(l,d,3)).enter().append("text").text(function(e){return m[e.getMonth()]}).attr("x",function(e){return 130+20*Math.floor(p(e,b)/7)}).attr("y",20).attr("class","calendar-monthlabel");var A=w.append("g");A.selectAll(".calendar-day").data(g).enter().append("rect").attr("class",r).attr("width",20).attr("height",20).style("fill",function(e){return!e.free&&e.inrange&&e.register?S(e.receipts):"#fff"}).attr("x",function(e,t){return 130+20*Math.floor(t/7)}).attr("y",function(e,t){return 30+t%7*20}).on("mouseover",a).on("mouseout",n).on("click",function(e){o(),h.browserHistory.push((0,y.buildURL)("/register/"+(0,_.dateFormatter)(e.date)))})}Object.defineProperty(t,"__esModule",{value:!0}),t.SeasonCalendar=void 0;var d=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),c=r(1),f=r(2),m=function(e){return e&&e.__esModule?e:{default:e}}(f),h=r(178),_=r(291),y=r(81);(t.SeasonCalendar=function(e){function t(){return a(this,t),n(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),d(t,[{key:"render",value:function(){var e=this;return(0,c.createElement)("div",{style:{width:"80%",margin:"0 auto",textAlign:"center"}},(0,c.createElement)("h2",null,"Calendrier et recettes de la saison"),(0,c.createElement)("div",{id:"scalendar",key:"d"+Math.round(1e4*Math.random()),ref:function(){return l(e.props.registers,"#scalendar")}}))}}]),t}(c.Component)).propTypes={registers:m.default.array}},734:function(e,t,r){"use strict";function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function i(){function e(){var e,p,d,f,m,h={},_=[],y=d3.range(o),b=[];for(r=[],a=[],e=0,f=-1;++f<o;){for(p=0,m=-1;++m<o;)p+=n[f][m];_.push(p),b.push(d3.range(o).reverse()),e+=p}for(i&&y.sort(function(e,t){return i(_[e],_[t])}),s&&b.forEach(function(e,t){e.sort(function(e,r){return s(n[t][e],n[t][r])})}),e=(l-c*o)/e,p=0,f=-1;++f<o;){for(d=p,m=-1;++m<o;){var R=y[f],g=b[R][m],k=n[R][g],v=p,E=p+=k*e;h[R+"-"+g]={index:R,subindex:g,startAngle:v,endAngle:E,value:k}}a[R]={index:R,startAngle:d,endAngle:p,value:(p-d)/e},p+=c}for(f=-1;++f<o;)for(m=f-1;++m<o;){var x=h[f+"-"+m],S=h[m+"-"+f];(x.value||S.value)&&r.push(x.value<S.value?{source:S,target:x}:{source:x,target:S})}u&&t()}function t(){r.sort(function(e,t){return u((e.source.value+e.target.value)/2,(t.source.value+t.target.value)/2)})}var r,a,n,o,i,s,u,p=Math.PI,l=2*p,d={},c=0;return d.matrix=function(e){return arguments.length?(o=(n=e)&&n.length,r=a=null,d):n},d.padding=function(e){return arguments.length?(c=e,r=a=null,d):c},d.sortGroups=function(e){return arguments.length?(i=e,r=a=null,d):i},d.sortSubgroups=function(e){return arguments.length?(s=e,r=null,d):s},d.sortChords=function(e){return arguments.length?(u=e,r&&t(),d):u},d.chords=function(){return r||e(),r},d.groups=function(){return a||e(),a},d}function s(){function e(e,t,r,a){var n=t.call(e,r,a),o=c.call(e,n,a),i=f.call(e,n,a)-y,s=m.call(e,n,a)-y;return{r:o,a0:[i],a1:[s],p0:[o*Math.cos(i),o*Math.sin(i)],p1:[o*Math.cos(s),o*Math.sin(s)]}}function t(e,t,r){var a=t[0]>=0?1:-1;return"A"+e+","+e+" 0 "+ +(r>_)+",1 "+(t[0]+a*h)+","+t[1]}function r(e){var t=e[0]>=0?1:-1;return"Q 0,0 "+(e[0]+t*h)+","+e[1]}function a(a,n){var o=e(this,l,a,n),i=e(this,d,a,n);return"M"+(o.p0[0]+h)+","+o.p0[1]+t(o.r,o.p1,o.a1-o.a0)+r(i.p0)+t(i.r,i.p1,i.a1-i.a0)+r(o.p0)+"Z"}function n(e){return e.radius}function o(e){return e.source}function i(e){return e.target}function s(e){return e.startAngle}function u(e){return e.endAngle}function p(e){return"function"==typeof e?e:function(){return e}}var l=o,d=i,c=n,f=s,m=u,h=0,_=Math.PI,y=_/2;return a.radius=function(e){return arguments.length?(c=p(e),a):c},a.pullOutSize=function(e){return arguments.length?(h=e,a):h},a.source=function(e){return arguments.length?(l=p(e),a):l},a.target=function(e){return arguments.length?(d=p(e),a):d},a.startAngle=function(e){return arguments.length?(f=p(e),a):f},a.endAngle=function(e){return arguments.length?(m=p(e),a):m},a}function u(e){function t(t,r){var a="gradient-"+t+"--"+r;if(void 0===R[a]){var n=g.append("linearGradient").attr("id",a).attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2","0").attr("spreadMethod","reflect");n.append("stop").attr("offset","5%").attr("stop-color",e.colorscale(t)),n.append("stop").attr("offset","45%").attr("stop-color","#A3A3A3"),n.append("stop").attr("offset","55%").attr("stop-color","#A3A3A3"),n.append("stop").attr("offset","95%").attr("stop-color",e.colorscale(r))}return a}function r(e){return e.startAngle+k}function a(e){return e.endAngle+k}function n(t){return function(r,a){f.selectAll("path.chord").filter(function(t){return t.source.index!==a&&t.target.index!==a&&""!==e.names[t.source.index]}).transition("fadeOnArc").style("opacity",t)}}function o(e){var t=e;f.selectAll("path.chord").transition("fadeOnChord").style("opacity",function(e){return e.source.index===t.source.index&&e.target.index===t.target.index?_:y})}function u(e,t){e.each(function(){for(var e,r=d3.select(this),a=r.text().split(/\s+/).reverse(),n=[],o=0,i=parseFloat(r.attr("dy")),s=r.text(null).append("tspan").attr("x",0).attr("y",0).attr("dy",i+"em");e=a.pop();)n.push(e),s.text(n.join(" ")),s.node().getComputedTextLength()>t&&(n.pop(),s.text(n.join(" ")),n=[e],s=r.append("tspan").attr("x",0).attr("y",0).attr("dy",1.1*++o+i+"em").text(e))})}console.log("initChord",e);var p={top:20,right:40,bottom:20,left:40},l=1900-p.left-p.right,d=800-p.top-p.bottom,c=d3.select(e.domcontainer).append("svg").attr("width",l+p.left+p.right).attr("height",d+p.top+p.bottom),f=c.append("g").attr("class","chordWrapper").attr("transform","translate("+(l/2+p.left)+","+(d/2+p.top)+")"),m=Math.min(l,d)/2-100,h=.95*m,_=.7,y=.02,b=c.append("g").attr("class","chordTitleWrapper");b.append("text").attr("class","title left").style("font-size","16px").attr("x",l/2+p.left-m-0).attr("y",40).text("Première partie de soirée"),b.append("line").attr("class","titleLine left").attr("x1",.6*(l/2+p.left-m-0)).attr("x2",1.4*(l/2+p.left-m-0)).attr("y1",48).attr("y2",48),b.append("text").attr("class","title right").style("font-size","16px").attr("x",l/2+p.left+m+0).attr("y",40).text("Deuxième partie de soirée"),b.append("line").attr("class","titleLine right").attr("x1",.6*(l/2+p.left-m-0)+2*(m+0)).attr("x2",1.4*(l/2+p.left-m-0)+2*(m+0)).attr("y1",48).attr("y2",48);var R={},g=f.append("defs"),k=2*Math.PI*(e.emptyStroke/(e.total+e.emptyStroke))/4,v=i().padding(.02).sortChords(d3.descending).matrix(e.matrix),E=d3.svg.arc().innerRadius(h).outerRadius(m).startAngle(r).endAngle(a),x=s().radius(h).startAngle(r).endAngle(a).pullOutSize(50),S=f.selectAll("g.group").data(v.groups).enter().append("g").attr("class","group").on("mouseover",n(y)).on("mouseout",n(_));S.append("path").style("stroke",function(t,r){return""===e.names[r]?"none":e.colorscale(e.names[r])}).style("fill",function(t,r){return""===e.names[r]?"none":e.colorscale(e.names[r])}).style("pointer-events",function(t,r){return""===e.names[r]?"none":"auto"}).attr("d",E).attr("transform",function(e){return e.pullOutSize=50*(e.startAngle+.001>Math.PI?-1:1),"translate("+e.pullOutSize+",0)"}),S.append("text").each(function(e){e.angle=(e.startAngle+e.endAngle)/2+k}).attr("dy",".35em").attr("class","titles").style("font-size","10px").attr("text-anchor",function(e){return e.angle>Math.PI?"end":null}).attr("transform",function(e){var t=E.centroid(e);return"translate("+(t[0]+e.pullOutSize)+","+t[1]+")rotate("+(180*e.angle/Math.PI-90)+")translate(20,0)"+(e.angle>Math.PI?"rotate(180)":"")}).text(function(t,r){return e.names[r]}).call(u,100),f.selectAll("path.chord").data(v.chords).enter().append("path").attr("class","chord").style("stroke","none").style("fill",function(r){return"url(#"+t(e.names[r.target.index],e.names[r.source.index])+")"}).style("opacity",function(t){return""===e.names[t.source.index]?0:_}).style("pointer-events",function(t){return""===e.names[t.source.index]?"none":"auto"}).attr("d",x).on("mouseover",o).on("mouseout",n(_))}Object.defineProperty(t,"__esModule",{value:!0}),t.GenreChord=void 0;var p=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),l=r(1),d=r(2),c=function(e){return e&&e.__esModule?e:{default:e}}(d),f=r(730);(t.GenreChord=function(e){function t(){return a(this,t),n(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),p(t,[{key:"render",value:function(){var e=this;return null===this.props.chord?(0,l.createElement)("div",{},"no data yet (genre chord)"):(0,l.createElement)("div",{id:"gchord",key:"d"+Math.round(1e4*Math.random()),ref:function(t){return u(Object.assign({},e.props.chord,{domcontainer:"#gchord",colorscale:f.genreColor}))}})}}]),t}(l.Component)).propTypes={chord:c.default.object}},741:function(e,t,r){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function n(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){return(0,m.createElement)(S.Link,{to:"/author/"+e.author_id,title:"joué "+e.pcount+" fois"},e.author_name+" ["+e.pcount+"]")}function p(e){function t(e,t){return(0,m.createElement)(S.Link,{to:"/play/"+t.play_id},e)}function r(e,t){return(0,m.createElement)(S.Link,{to:"/author/"+t.author_id},e)}var a=e.registers,n={},o=[];return a.forEach(function(e){var t=!0,r=!1,a=void 0;try{for(var o,i=e.plays[Symbol.iterator]();!(t=(o=i.next()).done);t=!0){var s=o.value;n[s.play_id]?(n[s.play_id].count++,s.reprise&&(n[s.play_id].reprise=!0),s.firstrun&&(n[s.play_id].firstrun=!0)):(s.count=1,n[s.play_id]=s)}}catch(e){r=!0,a=e}finally{try{!t&&i.return&&i.return()}finally{if(r)throw a}}}),Object.keys(n).forEach(function(e){o.push(n[e])}),(0,m.createElement)(R.Card,{className:(0,w.mdlclass)(12),style:{fontSize:"1em"}},(0,m.createElement)(R.CardTitle,{style:x.STYLES.titleChart},"Tableau des pièces jouées lors de cette saison"),(0,m.createElement)(R.CardText,{style:{margin:"auto",fontSize:"1em"},className:(0,w.mdlclass)(8)},(0,m.createElement)(g.BootstrapTable,{data:o,hover:!0,pagination:!0,options:{sizePerPage:25}},(0,m.createElement)(g.TableHeaderColumn,{dataField:"play_id",isKey:!0,hidden:!0},"ID"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"play_title",width:"20",filter:{type:"TextFilter",placeholder:"Rechercher une pièce",delay:300},dataSort:!0,dataFormat:t},"Pièce"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"play_genre",width:"10",dataSort:!0},"Genre"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"firstrun",dataSort:!0,width:"10",dataFormat:E.checkboxFormatter},"Première"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"reprise",width:"10",dataSort:!0,dataFormat:E.checkboxFormatter},"Reprise"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"author_name",width:"20",filter:{type:"TextFilter",placeholder:"Rechercher un auteur",delay:300},dataSort:!0,dataFormat:r},"Auteur"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"count",width:"20",dataSort:!0},"Nombre de représentations"))))}function l(e){var t=e.season,r=e.registers,a=e.firsts,o=e.reprises,i=r[0],s=r[r.length-1],u=[{label:"Première date",value:i.weekday+" "+(0,E.dateFormatter)(i.date)},{label:"Dernière date",value:s.weekday+" "+(0,E.dateFormatter)(s.date)}];return a.length&&u.push({label:"Premières",value:m.createElement.apply(void 0,["ul",{}].concat(n(a.map(function(e){return(0,m.createElement)("li",{},(0,m.createElement)(S.Link,{to:"/play/"+e.play_id,title:e.play_title+" - "+e.author_name},e.play_title+", le "+(0,E.dateFormatter)(e.firstRunDate)))}))))}),o.length&&u.push({label:"Reprises",value:m.createElement.apply(void 0,["ul",{}].concat(n(o.map(function(e){return(0,m.createElement)("li",{},(0,m.createElement)(S.Link,{to:"/play/"+e.play_id,title:e.play_title+" - "+e.author_name},e.play_title+", le "+(0,E.dateFormatter)(e.repriseDate)))}))))}),T.default[t]&&u.push({label:"Registre numérisé",value:(0,m.createElement)("a",{href:T.default[t].base_url,title:"Consulter le registre numérisé de saison "+t},"Consulter le registre numérisé de la saison "+t)}),(0,m.createElement)("section",{className:"section--center mdl-shadow--2dp",style:{justifyContent:"center",marginBottom:"50px"}},(0,m.createElement)(R.Card,{className:(0,w.mdlclass)(12),style:{fontSize:"1em"}},(0,m.createElement)(R.CardText,{style:{margin:"auto",fontSize:"1em"}},(0,E.infoprops)(u))),(0,m.createElement)(R.Card,{className:(0,w.mdlclass)(12),style:{fontSize:"1em"}},(0,m.createElement)(R.CardText,{style:{margin:"auto",fontSize:"1em"}},(0,m.createElement)(A.SeasonCalendar,{registers:r}))),(0,m.createElement)(p,{registers:r}))}function d(e){var t={},r=!0,a=!1,n=void 0;try{for(var o,i=e[Symbol.iterator]();!(r=(o=i.next()).done);r=!0){var s=c(o.value,2),u=(s[0],s[1]);void 0===t[u]?t[u]=1:t[u]++}}catch(e){a=!0,n=e}finally{try{!r&&i.return&&i.return()}finally{if(a)throw n}}var p=Object.keys(t).map(function(e){return[e,t[e]]}).sort(function(e,t){return t[1]-e[1]}),l=Number(p[0][0]),d=!1;return e.filter(function(e){var t=c(e,2);t[0];return t[1]!==l||!d&&(d=!0,!0)})}Object.defineProperty(t,"__esModule",{value:!0}),t.ASeasonPrimaryView=t.SeasonPrimaryView=t.SeasonChordDiagram=t.SeasonList=void 0;var c=function(){function e(e,t){var r=[],a=!0,n=!1,o=void 0;try{for(var i,s=e[Symbol.iterator]();!(a=(i=s.next()).done)&&(r.push(i.value),!t||r.length!==t);a=!0);}catch(e){n=!0,o=e}finally{try{!a&&s.return&&s.return()}finally{if(n)throw o}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),m=r(1),h=r(2),_=a(h),y=r(178),b=r(3),R=(a(b),r(64)),g=r(177),k=r(731),v=a(k),E=r(291),x=r(730),S=r(81),w=r(176),C=r(734),A=r(733),O=r(742),T=a(O);(t.SeasonList=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),f(t,[{key:"urlSeasonFormatter",value:function(e,t){var r=t.season;return(0,m.createElement)(S.Link,{to:"/season/"+r},e)}},{key:"render",value:function(){var e=this.props.seasons||[],t={noDataText:"Téléchargement des données ...",sizePerPage:50};return(0,m.createElement)(R.Card,{className:(0,w.mdlclass)({col:8,tablet:12}),style:{fontSize:"1em",margin:"auto",marginTop:"10px"}},(0,m.createElement)(R.CardText,{style:{margin:"auto",fontSize:"1em"}},(0,m.createElement)(g.BootstrapTable,{options:t,data:e,hover:!0,pagination:!0},(0,m.createElement)(g.TableHeaderColumn,{dataField:"id",isKey:!0,hidden:!0},"ID"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"season",dataSort:!0,dataFormat:this.urlSeasonFormatter,width:"15%"},"Saison"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"receipts",dataSort:!0,dataFormat:w.numberWithSpaces,width:"15%"},"Recettes (livres)"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"author1",dataSort:!0,dataFormat:u},"Auteur le plus joué en 1"),(0,m.createElement)(g.TableHeaderColumn,{dataField:"author2",dataSort:!0,dataFormat:u},"Auteur le plus joué en 2"))))}}]),t}(m.Component)).propTypes={seasons:_.default.array};var j=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),f(t,[{key:"componentDidMount",value:function(){var e=this.props.seasonData,t=e.registers,r=e.priceSeries,a={};t.forEach(function(e){a[(0,E.dateFormatter)(e.date)]=e});var o=[{name:"Recettes de la saison "+this.props.seasonLabel,type:"column",yAxis:0,data:t.map(function(e){return[(0,E.dateFormatter)(e.date),e.receipts]})}].concat(n(r.map(function(e){return{name:e.name,step:!0,lineWidth:0,marker:{enabled:!0},data:d(e.data).map(function(e){var t=c(e,2),r=t[0],a=t[1];return[(0,E.dateFormatter)(r),a]}),yAxis:1}})));return new v.default.Chart({chart:{renderTo:"seasonchart",zoomType:"xy"},title:{text:" "},subtitle:{text:"Le prix de référence des places n'est affiché que la première fois. Ensuite, seuls les variations (double, gratuit, etc.) sont affichées",floating:!0,align:"right",verticalAlign:"bottom",x:-80},xAxis:[{type:"category"}],yAxis:[{title:{text:"Recettes (livres)",style:{color:v.default.getOptions().colors[0]}}},{gridLineWidth:0,title:{text:"Prix des places (livres)",style:{color:v.default.getOptions().colors[1]}},opposite:!0}],plotOptions:{series:{cursor:"pointer",point:{events:{click:function(e){y.browserHistory.push((0,S.buildURL)("/register/"+e.point.name))}}}}},tooltip:{shared:!0,formatter:function(){var e=this.points[0].key,t=a[e],r=t.plays.map(function(e){return e.play_title}).join(" - "),n='<span style="font-size: 10px">'+t.weekday+" "+t.date+" - ["+r+"]</span><br/>",o=!0,i=!1,s=void 0;try{for(var u,p=this.points.slice(1)[Symbol.iterator]();!(o=(u=p.next()).done);o=!0){var l=u.value;n+='<br/><span style="color:'+l.series.color+'">●</span>'+l.series.name+": "+l.y+" livres"}}catch(e){i=!0,s=e}finally{try{!o&&p.return&&p.return()}finally{if(i)throw s}}return n}},series:o})}},{key:"render",value:function(){return(0,m.createElement)(R.Card,{className:(0,w.mdlclass)(12)},(0,m.createElement)(R.CardTitle,{style:x.STYLES.titleChart},"Recettes de la saison "+this.props.seasonLabel),(0,m.createElement)(R.CardText,{style:{margin:"auto"}},(0,m.createElement)("div",{id:"seasonchart"})))}}]),t}(m.Component);j.propTypes={seasonLabel:_.default.string,seasonData:_.default.object};var F=t.SeasonChordDiagram=function(e){function t(e,r){o(this,t);var a=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,r));return a.state={chord:null},a}return s(t,e),f(t,[{key:"componentDidMount",value:function(){var e=this;fetch((0,S.buildURL)("/season/chord-"+this.props.season+".json")).then(function(e){return e.json()}).then(function(t){return e.setState({chord:t})})}},{key:"render",value:function(){return(0,m.createElement)("section",{className:"section--center mdl-shadow--2dp",style:{justifyContent:"center"}},(0,m.createElement)("section",{className:"section--center",style:{marginBottom:"50px"}},(0,m.createElement)(R.Card,{className:(0,w.mdlclass)(12),style:{fontSize:"1em"}},(0,m.createElement)(R.CardTitle,{style:x.STYLES.titleChart},"Répartition des genres sur la saison "+this.props.season),(0,m.createElement)(C.GenreChord,{chord:this.state.chord}))))}}]),t}(m.Component);F.propTypes={season:_.default.string};!function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}s(t,e),f(t,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(e){e.data}}])}(m.Component);(t.SeasonPrimaryView=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),f(t,[{key:"render",value:function(){if(this.props.loading)return(0,m.createElement)(R.Spinner,{style:{margin:"auto",display:"block"}});var e=this.props.params.id.split("-"),t=c(e,2),r=t[0],a=t[1];r=Number(r),a=Number(a);var n=[];return r>1680&&n.push((0,m.createElement)(S.Link,{to:"/season/"+(r-1)+"-"+(a-1),title:"Saison "+(r-1)+"-"+(a-1)},(0,m.createElement)(R.IconButton,{name:"keyboard_arrow_left",colored:!0}))),n.push(this.props.params.id),a<1793&&n.push((0,m.createElement)(S.Link,{to:"/season/"+(r+1)+"-"+(a+1),title:"Saison "+(r+1)+"-"+(a+1)},(0,m.createElement)(R.IconButton,{name:"keyboard_arrow_right",colored:!0}))),(0,m.createElement)("section",null,m.createElement.apply(void 0,["h2",{style:{textAlign:"center"}}].concat(n)),(0,m.createElement)("div",null,(0,m.createElement)(l,Object.assign({season:this.props.params.id},this.props.mainentity))),(0,m.createElement)("div",null,(0,m.createElement)(j,{seasonData:this.props.mainentity,seasonLabel:this.props.params.id})),(0,m.createElement)(F,{season:this.props.params.id}))}}]),t}(m.Component)).propTypes={params:_.default.object,loading:_.default.bool,mainentity:_.default.object};var P=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),f(t,[{key:"componentDidMount",value:function(){var e=this.props.seasonData.season,t={};return e.forEach(function(e){t[(0,E.dateFormatter)(e.date)]=e}),new v.default.Chart({chart:{renderTo:"seasonchart",type:"column",zoomType:"x"},title:{text:" "},xAxis:{categories:e.map(function(e){return(0,E.dateFormatter)(e.date)})},yAxis:{title:{text:"Recettes (livres)"}},plotOptions:{series:{cursor:"pointer",point:{events:{click:function(e){y.browserHistory.push((0,S.buildURL)("/play/"+t[e.point.category].play_id))}}}}},series:[{name:"Recettes des pièces de "+this.props.seasonData.author.name+" sur la saison "+this.props.seasonLabel,data:e.map(function(e){return e.receipts})}],tooltip:{formatter:function(){var e=t[this.x];return e.weekday+" "+e.date+'<br /><b><a href="/play/'+e.play_id+'">'+e.play_title+"</a> (genre: "+e.play_genre+")"}}})}},{key:"render",value:function(){return(0,m.createElement)(R.Card,{className:(0,w.mdlclass)(12)},(0,m.createElement)(R.CardTitle,{style:x.STYLES.titleChart},"Recettes des pièces de "+this.props.seasonData.author.name+" sur la saison "+this.props.seasonLabel),(0,m.createElement)(R.CardText,{style:{margin:"auto"}},(0,m.createElement)("div",{id:"seasonchart"})))}}]),t}(m.Component);P.propTypes={seasonLabel:_.default.string,seasonData:_.default.object},(t.ASeasonPrimaryView=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return s(t,e),f(t,[{key:"render",value:function(){if(this.props.loading)return(0,m.createElement)(R.Spinner,{style:{margin:"auto",display:"block"}});var e=this.props.mainentity;return(0,m.createElement)("section",null,(0,m.createElement)("h2",{style:{textAlign:"center"}},e.author.name+" - "+this.props.params.season),(0,m.createElement)("div",{id:"overview"},(0,m.createElement)(P,{seasonData:e,seasonLabel:this.props.params.season})))}}]),t}(m.Component)).propTypes={loading:_.default.bool,params:_.default.object,mainentity:_.default.object}},742:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={"1680-1681":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R12/",r_num:"R12",pad1:!0},"1681-1682":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R13/",r_num:"R13",pad1:!0},"1682-1683":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R14/",r_num:"R14",pad1:!0},"1683-1684":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R15/",r_num:"R15",pad1:!0},"1684-1685":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R16/",r_num:"R16",pad1:!0},"1685-1686":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R17/",r_num:"R17",pad1:!0},"1686-1687":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R18/",r_num:"R18",pad1:!0},"1687-1688":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R20/",r_num:"R20",pad1:!0},"1688-1689":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R22/",r_num:"R22",pad1:!0},"1689-1690":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R23/",r_num:"R23",pad1:!0},"1690-1691":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R25/",r_num:"R25",pad1:!0},"1691-1692":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R27/",r_num:"R27",pad1:!0},"1692-1693":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R29/",r_num:"R29",pad1:!0},"1693-1694":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R31/",r_num:"R31",pad1:!0},"1694-1695":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R34/",r_num:"R34",pad1:!0},"1695-1696":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R36/",r_num:"R36",pad1:!0},"1696-1697":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R38/",r_num:"R38",pad1:!0},"1697-1698":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R40/",r_num:"R40",pad1:!0},"1698-1699":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R42/",r_num:"R42",pad1:!0},"1699-1700":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R43/",r_num:"R43",pad1:!0},"1700-1701":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R44/",r_num:"R44",pad1:!0},"1701-1702":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R46/",r_num:"R46",pad1:!0},"1702-1703":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R48/",r_num:"R48",pad1:!0},"1703-1704":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R49/",r_num:"R49",pad1:!0},"1704-1705":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R50/",r_num:"R50",pad1:!0},"1705-1706":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R51/",r_num:"R51",pad1:!0},"1706-1707":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R52/",r_num:"R52",pad1:!0},"1707-1708":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R53/",r_num:"R53",pad1:!0},"1708-1709":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R55/",r_num:"R55",pad1:!0},"1709-1710":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R57/",r_num:"R57",pad1:!0},"1710-1711":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R59/",r_num:"R59",pad1:!0},"1711-1712":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R61/",r_num:"R61",pad1:!0},"1712-17131":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R64/",r_num:"R64",pad1:!0},"1713-1714":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R65/",r_num:"R65",pad1:!0},"1714-1715":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R67/",r_num:"R67",pad1:!0},"1715-1716":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R69/",r_num:"R69",pad1:!0},"1716-1717":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R71/",r_num:"R71",pad1:!0},"1717-1718":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R73/",r_num:"R73",pad1:!0},"1718-1719*":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R76/",r_num:"R76",pad1:!0},1719:{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R78/",r_num:"R78",pad1:!0},"1719-1720":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R80/",r_num:"R80",pad1:!0},1720:{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R81/",r_num:"R81",pad1:!0},"1720-1721":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R82/",r_num:"R82",pad1:!0},"1721-1722":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R83/",r_num:"R83",pad1:!0},1722:{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R84/",r_num:"R84",pad1:!0},"1722-1723":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R85/",r_num:"R85",pad1:!0},"1723-1724":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R86/",r_num:"R86",pad1:!0},"1724-1725":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R87/",r_num:"R87",pad1:!0},"1725-1726":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R88/",r_num:"R88",pad1:!0},"1726-1727":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R89/",r_num:"R89",pad1:!0},"1727-1728":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R90/",r_num:"R90",pad1:!0},"1728-1729":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R91/",r_num:"R91",pad1:!0},"1729-1730":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R92/",r_num:"R92",pad1:!0},"1730-1731":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R93/",r_num:"R93",pad1:!0},"1731-1732":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R94/",r_num:"R94",pad1:!0},"1732-1733":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R95/",r_num:"R95",pad1:!0},"1733-1734":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R96/",r_num:"R96",pad1:!0},"1734-1735":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R97/",r_num:"R97",pad1:!0},"1735-1736":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R98/",r_num:"R98",pad1:!0},"1736-1737":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R99/",r_num:"R99",pad1:!0},1737:{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R100/",r_num:"R100",pad1:!0},"1737-1738":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R101/",r_num:"R101",pad1:!0},"1738-1739":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R102/",r_num:"R102",pad1:!0},"1740-1741":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R103/",r_num:"R103",pad1:!0},"1741-1742":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R104/",r_num:"R104",pad1:!0},"1742-1743":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R105/",r_num:"R105",pad1:!0},"1743-1744":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R106/",r_num:"R106",pad1:!0},"1744-1745":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R107/",r_num:"R107",pad1:!1},"1745-1746":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R108/",r_num:"R108",pad1:!1},"1746-1747":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R109/",r_num:"R109",pad1:!1},"1747-1748":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R110/",r_num:"R110",pad1:!1},"1748-1749":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R111/",r_num:"R111",pad1:!1},"1749-1750":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R112/",r_num:"R112",pad1:!1},"1750-1751":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R113/",r_num:"R113",pad1:!1},"1751-1752":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R114/",r_num:"R114",pad1:!1},"1752-1753":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R115/",r_num:"R115",pad1:!1},"1753-1754":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R116/",r_num:"R116",pad1:!1},"1754-1755":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R117/",r_num:"R117",pad1:!1},"1755-1756":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R118/",r_num:"R118",pad1:!1},"1756-1757":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R119/",r_num:"R119",pad1:!1},"1757-1758":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R120/",r_num:"R120",pad1:!1},"1758-1759":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R121/",r_num:"R121",pad1:!1},"1759-1760":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R122/",r_num:"R122",pad1:!1},"1760-1761":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R123/",r_num:"R123",pad1:!1},"1761-1762":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R124/",r_num:"R124",pad1:!1},"1762-1763":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R126/",r_num:"R126",pad1:!1},"1763-1764":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R128/",r_num:"R128",pad1:!1},"1764-1765":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R129/",r_num:"R129",pad1:!1},"1765-1766":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R130/",r_num:"R130",pad1:!1},"1766-1767":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R131/",r_num:"R131",pad1:!1},"1767-1768":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R132/",r_num:"R132",pad1:!1},"1768-1769":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R133/",r_num:"R133",pad1:!1},"1769-1770":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R134/",r_num:"R134",pad1:!1},"1770-1771":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R135/",r_num:"R135",pad1:!1},"1771-1772":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R136/",r_num:"R136",pad1:!1},"1772-1773":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R137/",r_num:"R137",pad1:!1},"1773-1774":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R138/",r_num:"R138",pad1:!1},"1774-1775":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R139/",r_num:"R139",pad1:!1},"1775-1776":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R140/",r_num:"R140",pad1:!1},"1776-1777":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R141/",r_num:"R141",pad1:!1},"1777-1778":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R142/",r_num:"R142",pad1:!1},"1778-1779":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R143/",r_num:"R143",pad1:!1},"1779-1780":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R144/",r_num:"R144",pad1:!1},"1780-1781":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R145/",r_num:"R145",pad1:!1},"1781-1782":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R146/",r_num:"R146",pad1:!1},"1782-1783":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R148/",r_num:"R148",pad1:!1},"1783-1784":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R149/",r_num:"R149",pad1:!1},"1784-1785":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R150/",r_num:"R150",pad1:!1},"1785-1786":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R151/",r_num:"R151",pad1:!1},"1786-1787":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R152/",r_num:"R152",pad1:!1},"1787-1788":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R153/",r_num:"R153",pad1:!1},"1788-1789":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R154/",r_num:"R154",pad1:!1},"1789-1790":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R155/",r_num:"R155",pad1:!1},"1790-1791":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R156/",r_num:"R156",pad1:!1},"1791-1792":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R157/",r_num:"R157",pad1:!1},"1792-1793":{base_url:"http://hyperstudio.mit.edu/cfrp/flip_books/R158/",r_num:"R158",pad1:!1}}}});