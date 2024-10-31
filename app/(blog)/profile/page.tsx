"use client";

import {Fragment, useEffect, useState} from "react";
import {ProfileDataResponse} from "@/app/customTypes";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import {IconButton, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from "next/image";
import urlBuilder from "@sanity/image-url";

function Row(props: { row: ReturnType<any> }) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.order_id}
                </TableCell>
                {/*<TableCell align="right">{row.name}</TableCell>*/}
                <TableCell align="right">{row.total_cost_cents/100}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">{new Date(row.created_at).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Line Items
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell>Variation Name</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Base Cost ($)</TableCell>
                                        <TableCell align="right">Total ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.line_items.map((line_item: any) => (
                                        <TableRow key={line_item.note}>
                                            <TableCell component="th" scope="row">
                                                {line_item.name}
                                            </TableCell>
                                            <TableCell>{line_item.variation_name}</TableCell>
                                            <TableCell align="right">{line_item.quantity}</TableCell>
                                            <TableCell align="right">{line_item.base_price_cents/100 }</TableCell>
                                            <TableCell align="right">
                                                {Math.round(line_item.quantity * line_item.base_price_cents/100)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileDataResponse>();

    useEffect(() => {
        //set 'profile-link' active
        document.getElementById("profile-link")?.classList.add("active");

        // fetch orders
        fetch("/api/profile")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProfile(data);
            })
            .catch(err => {
                console.error(err);
            });

    }, []);

    return (
        <div className={"profile-page"}>
            <div className={"profile-panel"}>
                <div className={"profile-picture-panel"}>
                    {
                        profile?.user.image &&
                        <Image src={profile?.user.image} width={200} height={200} alt={"profile picture"} />
                    }
                </div>
                <div className={"profile-details"}>
                    <h2>{profile?.user.name}</h2>
                    <p>{profile?.user.email}</p>
                </div>
                <div className={"profile-orders"}>
                    <h2>Orders</h2>
                    <TableContainer component={Paper}>
                        <Table aria-label={"orders table"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell >Order ID</TableCell>
                                    {/*<TableCell>Item</TableCell>*/}
                                    <TableCell align={"right"}>Total Cost ($)</TableCell>
                                    <TableCell align={"right"}>Status</TableCell>
                                    <TableCell align={"center"}>Created At</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {profile?.orders.map(order => {
                                    return (
                                        <Row key={order.order_id} row={order} />
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    )
}