import logo from './logo.svg';
import './App.css';
import { Theme } from '@twilio-paste/theme';

import { FlexStarterPackPage } from './pages/FlexStarterPackPage';

function App() {
  return (
    <Theme.Provider>
        <FlexStarterPackPage />
    </Theme.Provider>
    
  );
}

export default App;
