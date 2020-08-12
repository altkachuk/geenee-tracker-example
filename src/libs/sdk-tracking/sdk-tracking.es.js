import t from"@geenee/geenee-tracking-impl";class e{constructor(){this.timeStart=null,this.nLastElapsedMs=0,this.nTotalElapsedMs=0,this.nTotalTimes=0}setMeasurementStart(){this.timeStart=new Date}setMeasurementEnd(){var t=new Date;this.nLastElapsedMs=t-this.timeStart,this.nTotalElapsedMs+=this.nLastElapsedMs,this.nTotalTimes++}getLastElapsedMs(){return this.nLastElapsedMs}getAvgElapsedMs(){return this.nTotalTimes>0?this.nTotalElapsedMs/this.nTotalTimes:0}}const r=require("events");window.GeeneeTracking=class extends r{constructor(r){super(),this.runningRecognition=!1,this.runningVerification=!1,this.wasm_api={create_buffer:t.cwrap("create_buffer","number",["number","number"]),create_rototranslation_buffer:t.cwrap("create_rototranslation_buffer","number"),create_camera_matrix_buffer:t.cwrap("create_camera_matrix_buffer","number"),destroy_buffer:t.cwrap("destroy_buffer","",["number"]),load_target:t.cwrap("load_target","number",["number"]),draw_recognition_result:t.cwrap("draw_recognition_result","",["number","number","number","number"]),get_report:t.cwrap("get_report","string",["number","number"]),is_tracking:t.cwrap("is_tracking","number",[]),get_AR_update:t.cwrap("get_AR_update","number",["number","number","number"]),train:t.cwrap("train","",[]),verify_tracking:t.cwrap("verify_tracking","",[])},this.debugLevel=0,this.debugLevel>0&&(this.loadingStats=new e,this.processingStats=new e,this.visualizationStats=new e,this.totalStats=new e,this.loadGrountruth(r)),this.targetID=-1,this.focal=-1}report(e,r){try{var a;this.loadingStats.getAvgElapsedMs().toFixed(1);if("<br>Processing time avg [ms]: "+this.processingStats.getAvgElapsedMs().toFixed(1),"<br>Visualization time avg [ms]: "+this.visualizationStats.getAvgElapsedMs().toFixed(1),"<br>Total time avg [ms]: "+this.totalStats.getAvgElapsedMs().toFixed(1),1==r&&void 0!==this.groundtruth.results){this.groundtruth.resultsIdx=0|Math.ceil(e*this.groundtruth.fps);const r=new Float64Array(this.groundtruth.results[this.groundtruth.resultsIdx].homography);t.HEAPF64.set(r,this.groundtruth.homographyPtr/8),a=this.wasm_api.get_report(this.homographyPtr,this.groundtruth.homographyPtr)}else a=this.wasm_api.get_report();document.getElementById(this.wasm_api.is_tracking()?"report_tracking_details":"report_detection_details").innerHTML=a}catch(t){}}loadTarget(e){try{const r=this.wasm_api.create_buffer(e.width,e.height);t.HEAP8.set(e.data,r);this.wasm_api.load_target(r);this.wasm_api.destroy_buffer(r)}catch(t){document.getElementById("status").innerHTML=t+t.stack}}train(){this.wasm_api.train(),window.dispatchEvent(new Event("geenee-recognition-trained"))}loadGrountruth(t){this.groundtruth={},void 0!==t&&(this.groundtruth.results=t.recognition_results,this.groundtruth.fps=t.fps,this.groundtruth.resultsIdx=0)}init(t,e){t&&e&&(this.queryPtr=this.wasm_api.create_buffer(t,e),this.rototranslationPtr=this.wasm_api.create_rototranslation_buffer(),this.camMatrixPtr=this.wasm_api.create_camera_matrix_buffer(),window.dispatchEvent(new Event("geenee-recognition-initialized")))}verifyTracking(){var t=this;setImmediate((function(){!1===t.runningVerification&&(t.runningVerification=!0,t.wasm_api.verify_tracking(),t.runningVerification=!1)}))}recognize(e,r){var a=this;setImmediate((function(){if(!1===a.runningRecognition){var i;a.runningRecognition=!0;var s=null,n=-1;if(0===a.debugLevel)t.HEAP8.set(e.data,a.queryPtr),-1!==(n=a.wasm_api.get_AR_update(a.queryPtr,a.camMatrixPtr,a.rototranslationPtr))&&(i=new Float64Array(t.HEAPF64.buffer,a.rototranslationPtr,16),s=new Float64Array(t.HEAPF64.buffer,a.camMatrixPtr,12));else{if(a.totalStats.setMeasurementStart(),a.loadingStats.setMeasurementStart(),t.HEAP8.set(e.data,a.queryPtr),a.loadingStats.setMeasurementEnd(),a.processingStats.setMeasurementStart(),n=a.wasm_api.get_AR_update(a.queryPtr,a.camMatrixPtr,a.rototranslationPtr),a.processingStats.setMeasurementEnd(),a.visualizationStats.setMeasurementStart(),-1===n);else if(i=new Float64Array(t.HEAPF64.buffer,a.rototranslationPtr,16),s=new Float64Array(t.HEAPF64.buffer,a.camMatrixPtr,12),a.debugLevel>1){a.wasm_api.draw_recognition_result(n,a.queryPtr,a.camMatrixPtr,a.rototranslationPtr);const r=new Uint8Array(t.HEAP8.buffer,a.queryPtr,4*e.width*e.height);for(var o=0;o<r.length;o+=4)e.data[o]=r[o],e.data[o+1]=r[o+1],e.data[o+2]=r[o+2],e.data[o+3]=255}a.visualizationStats.setMeasurementEnd(),a.totalStats.setMeasurementEnd(),a.report(r,n)}a.runningRecognition=!1,a.targetID=n,s&&(a.focal=s[5]),a.emit("geenee-tracker-update",i,e)}}))}getTargetID(){return this.targetID}getFocal(){return this.focal}};let a=window.GeeneeTracking;export default a;