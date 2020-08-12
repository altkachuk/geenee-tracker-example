
import React, { Suspense } from "react";
import Loader from 'react-loader-spinner';

// import @geenee/sdk-core
import Geenee from '../libs/sdk-core/sdk-core'

// import @geenee/sdk-scene-library
import "../libs/sdk-scene-library/index.css";
import { StampScene } from '../libs/sdk-scene-library/index'

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


const App = () => {
  // Keep state
  const [drawerVisible, setDrawerVisible] = React.useState(false)
  const [debug, setDebug] = React.useState(true)
  const [targetsLoaded, setTargetsLoaded] = React.useState(0)

  // NOTE Define project IDs here!
  const projectsTracker = ['d5b3a848-dcd6-4ec3-b387-53232ccd5351']
  const projectsSlam = ['7ca9f99b-92c5-4d74-9db8-c8f92bb1cfc2']
  const internalSDKControls = true

  // little helper ;)
  const log = (...props) => {
    if (debug) console.log('Magellan:', ...props)
  }

  const appStarted = () => {
    log('app started')
  }

  const targetLoaded = () => {
    log('target loaded')
    setTargetsLoaded(targetsLoaded + 1)
  }

  const allTargetsLoaded = () => {
    log('allTargetsLoaded')
  }

  const videoLooped = () => {
    log('videoLooped')
    setDrawerVisible(true)
  }

  const EVENTS = {
    'geenee-app-started': appStarted,
    'geenee-target-loaded': targetLoaded,
    'geenee-all-targets-loaded': allTargetsLoaded,
    'geenee-arscene-video-ended': videoLooped,
  }

  React.useEffect(() => {
    Geenee.setTenant(process.env.GEENEE_TENANT);

    // Listen to events
    for (let [key, value] of Object.entries(EVENTS)) {
      window.addEventListener(key, value);
    }

    return () => {
      // Remove listeners
      for (let [key, value] of Object.entries(EVENTS)) {
        window.removeEventListener(key, value);
      }
    }
  }, [])

  // TODO Call methods

  // TODO Display UI

  // TODO Connect CMS

  return (
    <Suspense fallback={
      <div className='loader-container'>
        <Loader type='Triangle' color='#67C3D8' label='Loading' />
        <br />
        <div style={{ color: '#fff' }}>
          {targetsLoaded}/{projectsTracker.length} targets loaded
        </div>
      </div>
    }>
      <StampScene projects={projectsTracker} controls={internalSDKControls} />
      {/* <SlamScene projects={projectsSlam} /> */}
      {drawerVisible && 'drawer'}
      {
        !internalSDKControls &&
        <div style={{ zIndex: 9999, position: 'fixed', bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
          <button onClick={window.GeeneeAR && window.GeeneeAR.setStaticMode}>Static</button>
          <button onClick={window.GeeneeAR && window.GeeneeAR.setVideoMode}>Video</button>
          <button onClick={window.GeeneeAR && window.GeeneeAR.setCustomMode}>Custom</button>
        </div>
      }
    </Suspense>
  )
}

export default App;
