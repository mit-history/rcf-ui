/* global d3 */

import { createElement as ce, Component } from 'react';
import PropTypes from 'prop-types';

import { genreColor } from '../styles';

function customChordLayout() {
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////// Custom Chord Layout Function ////////////////
    /////// Places the Chords in the visually best order ///////
    ///////////////// to reduce overlap ////////////////////////
    ////////////////////////////////////////////////////////////
    ///////// Slightly adjusted by Nadieh Bremer ///////////////
    //////////////// VisualCinnamon.com ////////////////////////
    ////////////////////////////////////////////////////////////
    //////// Original from the d3.layout.chord() function //////
    ///////////////// from the d3.js library ///////////////////
    //////////////// Created by Mike Bostock ///////////////////
    ////////////////////////////////////////////////////////////

    const π = Math.PI,
        τ = 2 * π;

    var chord = {},
        chords,
        groups,
        matrix,
        n,
        padding = 0,
        sortGroups,
        sortSubgroups,
        sortChords;

    function relayout() {
        var subgroups = {},
            groupSums = [],
            groupIndex = d3.range(n),
            subgroupIndex = [],
            k,
            x,
            x0,
            i,
            j;
        chords = [];
        groups = [];
        (k = 0), (i = -1);
        while (++i < n) {
            (x = 0), (j = -1);
            while (++j < n) {
                x += matrix[i][j];
            }
            groupSums.push(x);
            subgroupIndex.push(d3.range(n).reverse());
            k += x;
        }
        if (sortGroups) {
            groupIndex.sort(function(a, b) {
                return sortGroups(groupSums[a], groupSums[b]);
            });
        }
        if (sortSubgroups) {
            subgroupIndex.forEach(function(d, i) {
                d.sort(function(a, b) {
                    return sortSubgroups(matrix[i][a], matrix[i][b]);
                });
            });
        }
        k = (τ - padding * n) / k;
        (x = 0), (i = -1);
        while (++i < n) {
            (x0 = x), (j = -1);
            while (++j < n) {
                var di = groupIndex[i],
                    dj = subgroupIndex[di][j],
                    v = matrix[di][dj],
                    a0 = x,
                    a1 = (x += v * k);
                subgroups[di + '-' + dj] = {
                    index: di,
                    subindex: dj,
                    startAngle: a0,
                    endAngle: a1,
                    value: v,
                };
            }
            groups[di] = {
                index: di,
                startAngle: x0,
                endAngle: x,
                value: (x - x0) / k,
            };
            x += padding;
        }
        i = -1;
        while (++i < n) {
            j = i - 1;
            while (++j < n) {
                var source = subgroups[i + '-' + j],
                    target = subgroups[j + '-' + i];
                if (source.value || target.value) {
                    chords.push(
                        source.value < target.value
                            ? {
                                  source: target,
                                  target: source,
                              }
                            : {
                                  source: source,
                                  target: target,
                              },
                    );
                }
            }
        }
        if (sortChords) resort();
    }
    function resort() {
        chords.sort(function(a, b) {
            return sortChords(
                (a.source.value + a.target.value) / 2,
                (b.source.value + b.target.value) / 2,
            );
        });
    }
    chord.matrix = function(x) {
        if (!arguments.length) return matrix;
        n = (matrix = x) && matrix.length;
        chords = groups = null;
        return chord;
    };
    chord.padding = function(x) {
        if (!arguments.length) return padding;
        padding = x;
        chords = groups = null;
        return chord;
    };
    chord.sortGroups = function(x) {
        if (!arguments.length) return sortGroups;
        sortGroups = x;
        chords = groups = null;
        return chord;
    };
    chord.sortSubgroups = function(x) {
        if (!arguments.length) return sortSubgroups;
        sortSubgroups = x;
        chords = null;
        return chord;
    };
    chord.sortChords = function(x) {
        if (!arguments.length) return sortChords;
        sortChords = x;
        if (chords) resort();
        return chord;
    };
    chord.chords = function() {
        if (!chords) relayout();
        return chords;
    };
    chord.groups = function() {
        if (!groups) relayout();
        return groups;
    };
    return chord;
}

function stretchedChord() {
    ////////////////////////////////////////////////////////////
    /////////////// Custom Chord Function //////////////////////
    //////// Pulls the chords pullOutSize pixels apart /////////
    ////////////////// along the x axis ////////////////////////
    ////////////////////////////////////////////////////////////
    ///////////// Created by Nadieh Bremer /////////////////////
    //////////////// VisualCinnamon.com ////////////////////////
    ////////////////////////////////////////////////////////////
    //// Adjusted from the original d3.svg.chord() function ////
    ///////////////// from the d3.js library ///////////////////
    //////////////// Created by Mike Bostock ///////////////////
    ////////////////////////////////////////////////////////////

    var source = d3_source,
        target = d3_target,
        radius = d3_svg_chordRadius,
        startAngle = d3_svg_arcStartAngle,
        endAngle = d3_svg_arcEndAngle,
        pullOutSize = 0;

    var π = Math.PI,
        halfπ = π / 2;

    function subgroup(self, f, d, i) {
        var subgroup = f.call(self, d, i),
            r = radius.call(self, subgroup, i),
            a0 = startAngle.call(self, subgroup, i) - halfπ,
            a1 = endAngle.call(self, subgroup, i) - halfπ;
        return {
            r: r,
            a0: [a0],
            a1: [a1],
            p0: [r * Math.cos(a0), r * Math.sin(a0)],
            p1: [r * Math.cos(a1), r * Math.sin(a1)],
        };
    }

    function arc(r, p, a) {
        var sign = p[0] >= 0 ? 1 : -1;
        return (
            'A' +
            r +
            ',' +
            r +
            ' 0 ' +
            +(a > π) +
            ',1 ' +
            (p[0] + sign * pullOutSize) +
            ',' +
            p[1]
        );
    }

    function curve(p1) {
        var sign = p1[0] >= 0 ? 1 : -1;
        return 'Q 0,0 ' + (p1[0] + sign * pullOutSize) + ',' + p1[1];
    }

    /*
     M = moveto
     M x,y
     Q = quadratic Bézier curve
     Q control-point-x,control-point-y end-point-x, end-point-y
     A = elliptical Arc
     A rx, ry x-axis-rotation large-arc-flag, sweep-flag  end-point-x, end-point-y
     Z = closepath

     M251.5579641956022,87.98204731514328
     A266.5,266.5 0 0,1 244.49937503334525,106.02973926358392
     Q 0,0 -177.8355222451483,198.48621369706098
     A266.5,266.5 0 0,1 -191.78901944612068,185.0384338992728
     Q 0,0 251.5579641956022,87.98204731514328
     Z
     */
    function chord(d, i) {
        var s = subgroup(this, source, d, i),
            t = subgroup(this, target, d, i);

        return (
            'M' +
            (s.p0[0] + pullOutSize) +
            ',' +
            s.p0[1] +
            arc(s.r, s.p1, s.a1 - s.a0) +
            curve(t.p0) +
            arc(t.r, t.p1, t.a1 - t.a0) +
            curve(s.p0) +
            'Z'
        );
    } //chord

    chord.radius = function(v) {
        if (!arguments.length) return radius;
        radius = d3_functor(v);
        return chord;
    };
    chord.pullOutSize = function(v) {
        if (!arguments.length) return pullOutSize;
        pullOutSize = v;
        return chord;
    };
    chord.source = function(v) {
        if (!arguments.length) return source;
        source = d3_functor(v);
        return chord;
    };
    chord.target = function(v) {
        if (!arguments.length) return target;
        target = d3_functor(v);
        return chord;
    };
    chord.startAngle = function(v) {
        if (!arguments.length) return startAngle;
        startAngle = d3_functor(v);
        return chord;
    };
    chord.endAngle = function(v) {
        if (!arguments.length) return endAngle;
        endAngle = d3_functor(v);
        return chord;
    };

    function d3_svg_chordRadius(d) {
        return d.radius;
    }

    function d3_source(d) {
        return d.source;
    }

    function d3_target(d) {
        return d.target;
    }

    function d3_svg_arcStartAngle(d) {
        return d.startAngle;
    }

    function d3_svg_arcEndAngle(d) {
        return d.endAngle;
    }

    function d3_functor(v) {
        return typeof v === 'function'
            ? v
            : function() {
                  return v;
              };
    }

    return chord;
}

function initChord(config) {
    const margin = { top: 20, right: 40, bottom: 20, left: 40 },
        width = 1900 - margin.left - margin.right, //document.querySelector(config.domcontainer).clientWidth - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    var svg = d3
        .select(config.domcontainer)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    var wrapper = svg
        .append('g')
        .attr('class', 'chordWrapper')
        .attr(
            'transform',
            'translate(' +
                (width / 2 + margin.left) +
                ',' +
                (height / 2 + margin.top) +
                ')',
        );

    var outerRadius = Math.min(width, height) / 2 - 100,
        innerRadius = outerRadius * 0.95,
        opacityDefault = 0.7, //default opacity of chords
        opacityLow = 0.02; //hover opacity of those chords not hovered over

    //How many pixels should the two halves be pulled apart
    var pullOutSize = 50;

    //////////////////////////////////////////////////////
    //////////////////// Titles on top ///////////////////
    //////////////////////////////////////////////////////

    var titleWrapper = svg.append('g').attr('class', 'chordTitleWrapper'),
        titleOffset = 40,
        titleSeparate = 0;

    //Title    top left
    titleWrapper
        .append('text')
        .attr('class', 'title left')
        .style('font-size', '16px')
        .attr('x', width / 2 + margin.left - outerRadius - titleSeparate)
        .attr('y', titleOffset)
        .text('Première partie de soirée');
    titleWrapper
        .append('line')
        .attr('class', 'titleLine left')
        .attr(
            'x1',
            (width / 2 + margin.left - outerRadius - titleSeparate) * 0.6,
        )
        .attr(
            'x2',
            (width / 2 + margin.left - outerRadius - titleSeparate) * 1.4,
        )
        .attr('y1', titleOffset + 8)
        .attr('y2', titleOffset + 8);
    //Title top right
    titleWrapper
        .append('text')
        .attr('class', 'title right')
        .style('font-size', '16px')
        .attr('x', width / 2 + margin.left + outerRadius + titleSeparate)
        .attr('y', titleOffset)
        .text('Deuxième partie de soirée');
    titleWrapper
        .append('line')
        .attr('class', 'titleLine right')
        .attr(
            'x1',
            (width / 2 + margin.left - outerRadius - titleSeparate) * 0.6 +
                2 * (outerRadius + titleSeparate),
        )
        .attr(
            'x2',
            (width / 2 + margin.left - outerRadius - titleSeparate) * 1.4 +
                2 * (outerRadius + titleSeparate),
        )
        .attr('y1', titleOffset + 8)
        .attr('y2', titleOffset + 8);

    ////////////////////////////////////////////////////////////
    /////////////////// Animated gradient //////////////////////
    ////////////////////////////////////////////////////////////

    const gradientIndex = {};
    var defs = wrapper.append('defs');
    function addGradient(source, target) {
        const gid = `gradient-${source}--${target}`;
        if (gradientIndex[gid] === undefined) {
            var linearGradient = defs
                .append('linearGradient')
                .attr('id', gid)
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0')
                .attr('spreadMethod', 'reflect');

            // linearGradient.append("animate")
            //     .attr("attributeName","x1")
            //     .attr("values","0%;100%")
            // //    .attr("from","0%")
            // //    .attr("to","100%")
            //     .attr("dur","7s")
            //     .attr("repeatCount","indefinite");

            // linearGradient.append("animate")
            //     .attr("attributeName","x2")
            //     .attr("values","100%;200%")
            // //    .attr("from","100%")
            // //    .attr("to","200%")
            //     .attr("dur","7s")
            //     .attr("repeatCount","indefinite");

            linearGradient
                .append('stop')
                .attr('offset', '5%')
                .attr('stop-color', config.colorscale(source));
            linearGradient
                .append('stop')
                .attr('offset', '45%')
                .attr('stop-color', '#A3A3A3');
            linearGradient
                .append('stop')
                .attr('offset', '55%')
                .attr('stop-color', '#A3A3A3');
            linearGradient
                .append('stop')
                .attr('offset', '95%')
                .attr('stop-color', config.colorscale(target));
        }
        return gid;
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////// Data ////////////////////////////
    ////////////////////////////////////////////////////////////
    //Calculate how far the Chord Diagram needs to be rotated clockwise to make the dummy
    //invisible chord center vertically
    var offset =
        2 *
        Math.PI *
        (config.emptyStroke / (config.total + config.emptyStroke)) /
        4;

    //Custom sort function of the chords to keep them in the original order
    var chord = customChordLayout() //d3.layout.chord()
        .padding(0.02)
        .sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
        .matrix(config.matrix);

    var arc = d3.svg
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle) //startAngle and endAngle now include the offset in degrees
        .endAngle(endAngle);

    var path = stretchedChord() //Call the stretched chord function
        .radius(innerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .pullOutSize(pullOutSize);

    ////////////////////////////////////////////////////////////
    //////////////////// Draw outer Arcs ///////////////////////
    ////////////////////////////////////////////////////////////
    var g = wrapper
        .selectAll('g.group')
        .data(chord.groups)
        .enter()
        .append('g')
        .attr('class', 'group')
        .on('mouseover', fade(opacityLow))
        .on('mouseout', fade(opacityDefault));

    g
        .append('path')
        .style('stroke', function(d, i) {
            return config.names[i] === ''
                ? 'none'
                : config.colorscale(config.names[i]);
        })
        .style('fill', function(d, i) {
            return config.names[i] === ''
                ? 'none'
                : config.colorscale(config.names[i]);
        })
        .style('pointer-events', function(d, i) {
            return config.names[i] === '' ? 'none' : 'auto';
        })
        .attr('d', arc)
        .attr('transform', function(d) {
            //Pull the two slices apart
            d.pullOutSize =
                pullOutSize * (d.startAngle + 0.001 > Math.PI ? -1 : 1);
            return 'translate(' + d.pullOutSize + ',' + 0 + ')';
        });

    ////////////////////////////////////////////////////////////
    ////////////////////// Append Names ////////////////////////
    ////////////////////////////////////////////////////////////

    //The text also needs to be displaced in the horizontal directions
    //And also rotated with the offset in the clockwise direction
    g
        .append('text')
        .each(function(d) {
            d.angle = (d.startAngle + d.endAngle) / 2 + offset;
        })
        .attr('dy', '.35em')
        .attr('class', 'titles')
        .style('font-size', '10px')
        .attr('text-anchor', function(d) {
            return d.angle > Math.PI ? 'end' : null;
        })
        .attr('transform', function(d) {
            var c = arc.centroid(d);
            return (
                'translate(' +
                (c[0] + d.pullOutSize) +
                ',' +
                c[1] +
                ')' +
                'rotate(' +
                (d.angle * 180 / Math.PI - 90) +
                ')' +
                'translate(' +
                20 +
                ',0)' +
                (d.angle > Math.PI ? 'rotate(180)' : '')
            );
        })
        .text(function(d, i) {
            return config.names[i];
        })
        .call(wrapChord, 100);

    ////////////////////////////////////////////////////////////
    //////////////////// Draw inner chords /////////////////////
    ////////////////////////////////////////////////////////////

    wrapper
        .selectAll('path.chord')
        .data(chord.chords)
        .enter()
        .append('path')
        .attr('class', 'chord')
        .style('stroke', 'none')
        //.style("fill", "#C4C4C4")
        .style('fill', d => {
            const gid = addGradient(
                config.names[d.target.index],
                config.names[d.source.index],
            );
            return `url(#${gid})`;
        })
        .style('opacity', function(d) {
            return config.names[d.source.index] === '' ? 0 : opacityDefault;
        }) //Make the dummy strokes have a zero opacity (invisible)
        .style('pointer-events', function(d) {
            return config.names[d.source.index] === '' ? 'none' : 'auto';
        }) //Remove pointer events from dummy strokes
        .attr('d', path)
        .on('mouseover', fadeOnChord)
        .on('mouseout', fade(opacityDefault));

    ////////////////////////////////////////////////////////////
    ////////////////// Extra Functions /////////////////////////
    ////////////////////////////////////////////////////////////

    //Include the offset in de start and end angle to rotate the Chord diagram clockwise
    function startAngle(d) {
        return d.startAngle + offset;
    }
    function endAngle(d) {
        return d.endAngle + offset;
    }

    // Returns an event handler for fading a given chord group
    function fade(opacity) {
        return function(d, i) {
            wrapper
                .selectAll('path.chord')
                .filter(function(d) {
                    return (
                        d.source.index !== i &&
                        d.target.index !== i &&
                        config.names[d.source.index] !== ''
                    );
                })
                .transition('fadeOnArc')
                .style('opacity', opacity);
        };
    } //fade

    // Fade function when hovering over chord
    function fadeOnChord(d) {
        var chosen = d;
        wrapper
            .selectAll('path.chord')
            .transition('fadeOnChord')
            .style('opacity', function(d) {
                return d.source.index === chosen.source.index &&
                    d.target.index === chosen.target.index
                    ? opacityDefault
                    : opacityLow;
            });
    } //fadeOnChord

    /*Taken from http://bl.ocks.org/mbostock/7555321
     //Wraps SVG text*/
    function wrapChord(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = 0,
                x = 0,
                dy = parseFloat(text.attr('dy')),
                tspan = text
                    .text(null)
                    .append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', dy + 'em');

            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text
                        .append('tspan')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                        .text(word);
                }
            }
        });
    } //wrapChord
}

export class GenreChord extends Component {
    static propTypes = {
        chord: PropTypes.object,
    };

    render() {
        if (this.props.chord === null) {
            return ce('div', {}, 'no data yet (genre chord)');
        }
        return ce('div', {
            id: 'gchord',
            key: 'd' + Math.round(Math.random() * 10000), // XXX
            ref: thediv =>
                initChord(
                    Object.assign({}, this.props.chord, {
                        domcontainer: '#gchord',
                        colorscale: genreColor,
                    }),
                ),
        });
    }
}
