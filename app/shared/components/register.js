import { createElement as ce } from 'react';

import { Card, CardTitle, CardText, Spinner, IconButton } from 'react-mdl';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { mdlclass } from '.';
import { dateFormatter, infoprops } from '..';
import { Link } from '../urls';
import { STYLES } from '../styles';

function registerPlaysOverview({ plays }) {
    function playFormatter(cell, row) {
        return ce(Link, { to: `/play/${row.play_id}` }, cell);
    }

    function authorFormatter(cell, row) {
        return ce(Link, { to: `/author/${row.author_id}` }, cell);
    }

    return ce(
        Card,
        { className: mdlclass({ col: 9, tablet: 12 }) },
        ce(CardTitle, { style: STYLES.titleChart }, 'Pièces jouées'),
        ce(
            CardText,
            { style: { margin: 'auto', fontSize: '1em' } },
            ce(
                BootstrapTable,
                { data: plays, hover: true },
                ce(
                    TableHeaderColumn,
                    {
                        dataField: 'title',
                        dataSort: true,
                        width: '35%',
                        dataFormat: playFormatter,
                    },
                    'Titre',
                ),
                ce(
                    TableHeaderColumn,
                    {
                        dataField: 'author_name',
                        dataSort: true,
                        width: '35%',
                        dataFormat: authorFormatter,
                    },
                    'Auteur',
                ),
                ce(
                    TableHeaderColumn,
                    {
                        dataField: 'genre',
                        width: '10%',
                        dataSort: true,
                    },
                    'Genre',
                ),
                ce(
                    TableHeaderColumn,
                    {
                        dataField: 'reprise',
                        width: '10%',
                        dataSort: true,
                    },
                    'Reprise',
                ),
                ce(
                    TableHeaderColumn,
                    {
                        dataField: 'ordering',
                        dataSort: true,
                        width: '10%',
                        isKey: true,
                    },
                    'Ordre',
                ),
            ),
        ),
    );
}

function imageComponent(imageList, date){
    const hasImg = imageList.length > 0;
    let imageComp = null;
    let pagenum = null;
    let rnum = null;

    if(hasImg){
        pagenum = /.*?_([0-9]+)\.jpg/.exec(imageList[0].url)[1];
        rnum = imageList[0].rnum;

        imageComp = ce('a', {
            href: `http://hyperstudio.mit.edu/cfrp/flip_books/${rnum}/#page/${pagenum}/mode/1up`,
            title: 'Consulter la page du registre pour la soirée du '+(date),
            target: "_blank"
        },
        ce('img', {src: imageList[0].url, className: 'register-image' })
        );
    }

    return imageComp;
}

function registerMainCardView({ register }) {
    const { date, weekday, receipts } = register;
    let { prevdate, nextdate } = register;
    const titleNavElements = [];

    if (prevdate) {
        titleNavElements.push(
            ce(
                Link,
                {
                    to: `/register/${dateFormatter(prevdate)}`,
                    title: `Soirée du ${dateFormatter(prevdate)}`,
                },
                ce(IconButton, { name: 'keyboard_arrow_left', colored: true }),
            ),
        );
    }
    titleNavElements.push(dateFormatter(date));
    if (nextdate) {
        titleNavElements.push(
            ce(
                Link,
                {
                    to: `/register/${dateFormatter(nextdate)}`,
                    title: `Soirée du ${dateFormatter(nextdate)}`,
                },
                ce(IconButton, { name: 'keyboard_arrow_right', colored: true }),
            ),
        );
    }
    return ce(
        'section',
        {
            className: 'section--center mdl-grid',
            style: { justifyContent: 'center' },
        },
        imageComponent(register.imageList, dateFormatter(date)),
        ce(
            Card,
            { className: mdlclass({ col: 3, tablet: 6, phone: 4 }) },
            ce(CardTitle, null, ...titleNavElements),
            infoprops([
                { label: 'Jour de la semaine', value: weekday },
                { label: 'Recettes', value: `${receipts} livres` },
                {
                    label: 'Notes relatives aux recettes',
                    value: register.payment_notes,
                    valueClass: 'notes',
                },
                {
                    label: 'Notes diverses',
                    value: register.misc_notes,
                    valueClass: 'notes',
                },
                {
                    label: 'Note éditeur',
                    value: register.editor_notes,
                    valueClass: 'notes',
                },
                {
                    label: 'Présence exceptionnelle',
                    value: register.ex_attendance,
                    valueClass: 'notes',
                },
                {
                    label: 'Représentation exceptionelle',
                    value: register.ex_representation,
                    valueClass: 'notes',
                },
                {
                    label: 'Lieu de représentation exceptionnel',
                    value: register.ex_place,
                    valueClass: 'notes',
                },
            ]),
        ),
    );
}

export function RegisterPrimaryView({ loading, mainentity }) {
    if (!loading) {
        return ce(
            'div',
            { id: 'overview' },
            ce(registerMainCardView, { register: mainentity }),
            ce(
                'section',
                { className: 'section--center mdl-grid' },
                ce(registerPlaysOverview, { plays: mainentity.plays }),
            ),
        );
    } else {
        return ce(Spinner, { style: { margin: 'auto', display: 'block' } });
    }
}
