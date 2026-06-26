import { Box, Button } from '@chakra-ui/react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profile from './components/Profile'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contatti from './components/Contatti'

function App() {
  return (
    <Box
    bg="black"
    minHeight="100vh"
    margin="0"
    >
      <header>
        <Navbar/>
        <Hero />
      </header>
      <main>
        <Profile />
        <Skills />
        <Projects />
        <Contatti />
      </main>
    </Box>
  );
}

export default App;

