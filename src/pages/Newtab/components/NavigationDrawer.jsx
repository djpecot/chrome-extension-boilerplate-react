import React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const MenuDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const NavigationDrawer = ({ isNavDrawerOpen, currentPage, showDefaultPage, showUpworkTimeline, handleMouseEnter, handleMouseLeave }) => {
    return (
        <MenuDrawer
            variant="permanent"
            open={isNavDrawerOpen}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            PaperProps={{
                sx: {
                    backgroundColor: "transparent",
                    color: 'white',
                }
            }}
        >
            <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isNavDrawerOpen ? 'initial' : 'center',
                            px: 2.5,
                            color: 'white'
                        }}
                        selected={currentPage === 'default'}
                        onClick={showDefaultPage}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isNavDrawerOpen ? 3 : 'auto',
                                justifyContent: 'center',
                                color: 'white'
                            }}
                        >
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" sx={{ opacity: isNavDrawerOpen ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: isNavDrawerOpen ? 'initial' : 'center',
                            px: 2.5,
                            color: 'white'
                        }}
                        selected={currentPage === 'timeline'}
                        onClick={showUpworkTimeline}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: isNavDrawerOpen ? 3 : 'auto',
                                justifyContent: 'center',
                                color: 'white'
                            }}
                        >
                            <ViewTimelineOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Timeline" sx={{ opacity: isNavDrawerOpen ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
                {/* Add more ListItems here for other menu items */}
            </List>
        </MenuDrawer>
    );
};

export default NavigationDrawer;