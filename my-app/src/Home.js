import { Box } from '@mui/material';
import InputForm from './User-Input/InputForm';

const Home = () => {
    return (
        <Box
            sx={{
                backgroundColor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh',
                color: 'white',
            }}
        >
            <InputForm/>
        </Box>
    );
}

export default Home;
