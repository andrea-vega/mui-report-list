import {useEffect, useState, createContext, useContext, useReducer, useMemo} from 'react';
import {
    List,
    ListItemButton,
    Stack,
    ListItem,
    ListItemIcon,
    Card,
    CardContent,
    Typography,
    Button,
    CardActions, Paper, Fade, Box, IconButton
} from '@mui/material';

import {Edit} from '@mui/icons-material';

import SelectedReportContext from '../context/SelectedReportContext';
import * as React from "react";
import EditReportDialog from "../dialogs/EditReportDialog";


function reducer(state, action) {
    switch (action.type) {
        case 'SET_SELECTED': {
            // object reference needs to  change so that React knows something changed
            return {...state, selectedReport: action.report};
        }
        case 'OPEN_EDIT_DIALOG': {
            return {...state, selectedReport: action.report, editOpen: true};
        }
        case 'SAVE_REPORT': {
            (async() => {
                const result = await fetch(`/api/reports/${action.report.id}`);
                const reportResult = await result.json();
                console.log('We did it!');
                reducer(state, { type: 'REPORT_UPDATED', report: reportResult });
            })();
        }
        case 'REPORT_UPDATED': {
            return {...state, selectedReport: action.report, editOpen: false};
        }
        case 'CANCEL_EDIT': {
            return {...state, editOpen: false};
        }
        default:
            return state;
    }
}

export default function ReportListPage() {

    const [reports, setReports] = useState(null);
    const [error, setError] = useState(null);
    const [showReportInfo, setShowReportInfo] = useState(false);
    const [{ editOpen, selectedReport }, dispatch] = useReducer(reducer, {selectedReport: null, editOpen: false});

    const value = useMemo(() => ({
        editOpen,
        selectedReport,
        setSelectedReport: report => dispatch({
            type: 'SET_SELECTED',
            report: report
        }),
        editReport: report => dispatch({
            type: 'OPEN_EDIT_DIALOG',
            report: report
        }),
        saveReport: report => dispatch({
            type: 'SAVE_REPORT',
            report: report
        }),
        cancelEdit: () => dispatch({
            type: 'CANCEL_EDIT'
        })

    }), [editOpen, selectedReport]);

    useEffect(() => {
        (async () => {

            try {
                const response = await fetch('/api/reports-list');
                const json = await response.json();
                setError(null);
                setReports(json);
                setShowReportInfo(true);
            } catch (err) {
                setError(err);
            }

        })();

    }, []);

    if (error) return <h2>ERROR!</h2>;

    if (!reports) return <h1>LOADING...</h1>;

    return <SelectedReportContext.Provider value={value}>
        <Stack direction="row" spacing={2}>
            <Box sx={{overflowY: 'auto', height: '100vh', width: '500px', maxWidth: '500px'}}>
                <ReportList reports={reports}/>
            </Box>
            <ReportInfo/>
            <Fade in={showReportInfo} timeout={4000}>
                {<div>Hello</div>}
            </Fade>
        </Stack>
    </SelectedReportContext.Provider>;

}

function ReportInfo() {

    const {selectedReport} = useContext(SelectedReportContext);

    if (!selectedReport) return;

    return <Card sx={{minWidth: 275}}>
        <CardContent>
            <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                {selectedReport.name}
            </Typography>
            <Typography variant="h5" component="div">
                {selectedReport.description}
            </Typography>
            <Typography sx={{mb: 1.5}} color="text.secondary">
                by: {selectedReport.owner}
            </Typography>
            <Typography variant="body2">
                {selectedReport.type}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Learn More</Button>
        </CardActions>
    </Card>;
}


function ReportList({reports}) {
    const {editOpen, cancelEdit, selectedReport, saveReport} = useContext(SelectedReportContext);

    return <>
        <EditReportDialog report={selectedReport} open={editOpen} close={cancelEdit} save={saveReport}/>
        <List>
            {reports.map(report =>
                <ReportItem report={report} key={report.id}/>
            )}
        </List>
    </>;
}

function ReportItem({report}) {
    const {selectedReport, setSelectedReport, editReport} = useContext(SelectedReportContext);

    if (!report) return;

    return <ListItem
        selected={selectedReport?.id === report.id}
        onClick={() => setSelectedReport(report)}
        secondaryAction={
            <IconButton edge="end" onClick={() => editReport(report)}>
                <Edit/>
            </IconButton>
        }
    >
        <ListItemIcon>
            {report.name}
        </ListItemIcon>
    </ListItem>;
}
