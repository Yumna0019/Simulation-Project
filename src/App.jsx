import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Queue from './pages/Queue'; 
import Simulation from './pages/Simulation'; 
import MG1 from './components/MG1';
import MGS from './components/MGS';
import MM1 from './components/MM1';
import MMS from './components/MMS';
import GG1 from './components/GG1';
import GGS from './components/GGS';
import MMSimulate from './simulate/MMSimulate'
import MGSimulate from './simulate/MGSimulate'
import MG_Poisson_Uni from './simulate/MG_Poisson_Uni'; 
import MMS_without from './simulate/MMS_without'
import MG from './simulate/MG'
import MG_Poisson_norm from './simulate/MG_Poisson_norm'; 
import MG_Exp_uni from './simulate/MG_Exp_uni'
import MG_Exp_norm from './simulate/MG_Exp_norm'
import GG from './simulate/GG'
import GGS_without from './simulate/GGS_without';
import GG_uni_uni from './simulate/GG_uni_uni'
import GG_uni_norm from './simulate/GG_uni_norm'
import MMS_with from './simulate/MMS_with'
import GG_norm_norm from './simulate/GG_norm_norm'
import GG_norm_uni from './simulate/GG_norm_uni'
import MG_with from './simulate/MG_with'
import MG_with_poisson_norm from './simulate/MG_with_poisson_norm'; 
import MG_with_poisson_uni from './simulate/MG_with_poisson_uni'; 
import MG_with_exp_norm from './simulate/MG_with_exp_norm'; 
import MG_with_exp_uni from './simulate/MG_with_exp_uni'; 
import GGS_with from './simulate/GGS_with';
import GG_with_uni_uni from './simulate/GG_with_uni_uni'
import GG_with_uni_norm from './simulate/GG_with_uni_norm'
import GG_with_norm_uni from './simulate/GG_with_norm_uni'
import GG_with_norm_norm from './simulate/GG_with_norm_norm'
import GM from './simulate/GM'
import GMS_with from './simulate/GMS_with'
import GMS_without from './simulate/GMS_without'
import GM_with_norm_exp from './simulate/GM_with_norm_exp'
import GM_with_norm_poisson from './simulate/GM_with_norm_poisson'
import GM_with_uni_exp from './simulate/GM_with_uni_exp'
import GM_with_uni_poisson from './simulate/GM_with_uni_poisson'
import GM_without_uni_exp from './simulate/GM_without_uni_exp'
import GM_without_uni_poisson from './simulate/GM_without_uni_poisson'
import GM_without_norm_exp from './simulate/GM_without_norm_exp'
import GM_without_norm_poisson from './simulate/GM_without_norm_poisson'
import MMS_with_poisson_exp from './simulate/MMS_with_poisson_exp'
import MMS_with_poisson_poisson from './simulate/MMS_with_poisson_poisson'
import MMS_with_exp_exp from './simulate/MMS_with_exp_exp'
import MMS_with_exp_poisson from './simulate/MMS_with_exp_poisson'
import MMS_without_poisson_exp from './simulate/MMS_without_poisson_exp'
import MMS_without_poisson_poisson from './simulate/MMS_without_poisson_poisson'
import MMS_without_exp_exp from './simulate/MMS_without_exp_exp'
import MMS_without_exp_poisson from './simulate/MMS_without_exp_poisson'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path='/mm1' element={<MM1/>}/>
        <Route path='/mms' element={<MMS/>}/>
        <Route path='/mg1' element={<MG1/>}/>
        <Route path='/mgs' element={<MGS/>}/>
        <Route path='/gg1' element={<GG1/>}/>
        <Route path='/ggs' element={<GGS/>}/>
        <Route path='/mmSimulate' element={<MMSimulate/>}/>
        <Route path="/mgSimulate" element={<MGSimulate/>} />
        <Route path="/MG_poisson_uni" element={<MG_Poisson_Uni/>} />
        <Route path="/MMS_without" element={<MMS_without/>} />
        <Route path="/MG" element={<MG/>} />
        <Route path="/MG_poisson_norm" element={<MG_Poisson_norm/>} />
        <Route path="/MG_Exp_uni" element={<MG_Exp_uni/>} />
        <Route path="/MG_Exp_norm" element={<MG_Exp_norm/>} />
        <Route path="/GG" element={<GG/>} />
        <Route path="/GGS_without" element={<GGS_without/>} />
        <Route path="/GG_uni_uni" element={<GG_uni_uni/>} />
        <Route path="/GG_uni_norm" element={<GG_uni_norm/>} />
        <Route path="/MMS_with" element={<MMS_with/>} />
        <Route path="/GG_norm_norm" element={<GG_norm_norm/>} />
        <Route path="/GG_norm_uni" element={<GG_norm_uni/>} />
        <Route path="/MG_with" element={<MG_with/>} />
        <Route path="/MG_with_poisson_norm" element={<MG_with_poisson_norm/>} />
        <Route path="/MG_with_poisson_uni" element={<MG_with_poisson_uni/>} />
        <Route path="/MG_with_exp_norm" element={<MG_with_exp_norm/>} />
        <Route path="/MG_with_exp_uni" element={<MG_with_exp_uni/>} />
        <Route path="/GGS_with" element={<GGS_with/>} />
        <Route path="/GG_with_uni_uni" element={<GG_with_uni_uni/>} />
        <Route path="/GG_with_uni_norm" element={<GG_with_uni_norm/>} />
        <Route path="/GG_with_norm_uni" element={<GG_with_norm_uni/>} />
        <Route path="/GG_with_norm_norm" element={<GG_with_norm_norm/>} />
        <Route path="/GM" element={<GM/>} />
        <Route path="/GMS_with" element={<GMS_with/>} />
        <Route path="/GMS_without" element={<GMS_without/>} />
        <Route path="/GM_with_norm_exp" element={<GM_with_norm_exp/>} />
        <Route path="/GM_with_norm_poisson" element={<GM_with_norm_poisson/>} />
        <Route path="/GM_with_uni_exp" element={<GM_with_uni_exp/>} />
        <Route path="/GM_with_uni_poisson" element={<GM_with_uni_poisson/>} />
        <Route path="/GM_without_uni_exp" element={<GM_without_uni_exp/>} />
        <Route path="/GM_without_uni_poisson" element={<GM_without_uni_poisson/>} />
        <Route path="/GM_without_norm_exp" element={<GM_without_norm_exp/>} />
        <Route path="/GM_without_norm_poisson" element={<GM_without_norm_poisson/>} />
        <Route path="/MMS_with_poisson_exp" element={<MMS_with_poisson_exp/>} />
        <Route path="/MMS_with_poisson_poisson" element={<MMS_with_poisson_poisson/>} />
        <Route path="/MMS_with_exp_exp" element={<MMS_with_exp_exp/>} />
        <Route path="/MMS_with_exp_poisson" element={<MMS_with_exp_poisson/>} />
        <Route path="/MMS_without_poisson_exp" element={<MMS_without_poisson_exp/>} />
        <Route path="/MMS_without_poisson_poisson" element={<MMS_without_poisson_poisson/>} />
        <Route path="/MMS_without_exp_exp" element={<MMS_without_exp_exp/>} />
        <Route path="/MMS_without_exp_poisson" element={<MMS_without_exp_poisson/>} />

      </Routes>
    </Router>
  );
}

export default App;



// // home -> proj heading name and seatno. user option quwuing ye simulation
// // route to queue = user option which queue => route to new 
// // route to simualtion







