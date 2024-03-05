import React from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const EditModal = ({
    isModalOpen,
    setIsModalOpen,
    editingCard,
    handleEditChange,
    saveCard,
    deleteCounter,
    deleteCard
}) => {
    return (
        <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={isModalOpen}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    outline: 'none'
                }}>
                    {editingCard && 'number' in editingCard ? (
                        // Counter card editing UI
                        <>
                            <Typography variant="h6" component="h2">
                                Edit Counter
                            </Typography>
                            <TextField
                                label="Title"
                                value={editingCard.title}
                                onChange={(e) => handleEditChange(e, 'title')}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Number"
                                type="number"
                                value={editingCard.number}
                                onChange={(e) => handleEditChange(e, 'number')}
                                fullWidth
                                margin="normal"
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button variant="contained" color="primary" onClick={saveCard}>
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => deleteCounter(editingCard.id)}
                                    sx={{ marginLeft: '8px' }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </>
                    ) : (
                        // Link card editing UI
                        <>
                            <Typography variant="h6" component="h2">
                                Edit Card
                            </Typography>
                            <TextField
                                label="Title"
                                value={editingCard?.title || ''}
                                onChange={(e) => handleEditChange(e, 'title')}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Description"
                                value={editingCard?.description || ''}
                                onChange={(e) => handleEditChange(e, 'description')}
                                fullWidth
                                margin="normal"
                                multiline
                            />
                            <TextField
                                label="Link"
                                value={editingCard?.link || ''}
                                onChange={(e) => handleEditChange(e, 'link')}
                                fullWidth
                                margin="normal"
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button variant="contained" color="primary" onClick={saveCard}>
                                    Save
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => deleteCard(editingCard.id)}
                                    sx={{ marginLeft: '8px' }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Fade>
        </Modal>
    );
};

export default EditModal;