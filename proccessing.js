
async function loadModel(img) {
    
    const model = await tf.loadGraphModel('TFJS/model.json');
    let result = await model.execute(
        { 'X_3': img },
        ['accuracy_calc_5/prediction']);
    // result.print();
    
    const res= await result.data();
    // console.log(`result: ${res}`);
    return res;

}

async function predictImage() {
    console.log('Predict');
    let image = cv.imread(canvas);

    // Thresholding the image
    cv.cvtColor(image, image, cv.COLOR_RGB2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

    // find the contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    //make a rect aroung the number
    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    // separating rect from the canvas
    image = image.roi(rect);

    var height = image.rows;
    var width = image.cols;

    // adjusting the long side to be 20px 
    if (height > width) {
        height = 20;
        const proportion = Math.round(image.rows / height);
        width = Math.round(width / proportion);
    }
    else {
        width = 20;
        const proportion = Math.round(image.cols / width);
        height = Math.round(height / proportion);

    }
    // resizing the image according to height and width adjustments
    let dsize = new cv.Size(width, height);
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    // add peddings to each side 
    const Left = Math.ceil(4 + (20 - width) / 2);  //ceil rounds up, floor down
    const Right = Math.floor(4 + (20 - width) / 2);
    const Top = Math.ceil(4 + (20 - height) / 2);
    const Bottom = Math.floor(4 + (20 - height) / 2);
    // console.log(`top: ${Top}, bottom: ${Bottom}, left: ${Left}, right: ${Right}`);
    const Black = new cv.Scalar(0, 0, 0); //padding the image
    cv.copyMakeBorder(image, image, Top, Bottom, Left, Right, cv.BORDER_CONSTANT, Black);

    // calculate the center of mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);

    // coordinates of the centroid
    const Cx = Moments.m10 / Moments.m00;
    const Cy = Moments.m01 / Moments.m00;
    // console.log(`Cx: ${Cx}, Cy: ${Cy}, Moments: ${Moments.m00}`);

    // shifting the image 
    const X_shift = Math.round(image.cols / 2 - Cx);
    const Y_shift = Math.round(image.rows / 2 - Cy);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_shift, 0, 1, Y_shift]);
    dsize = new cv.Size(image.cols, image.rows);
    cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, Black);

    // normalizind image (m=now pixles are between 0 and 255, we want them to be between 0 and 1)
    let pixelValue=image.data;
    // convert to float
    pixelValue=Float32Array.from(pixelValue);
    pixelValue=pixelValue.map(function(item){
        return item/255.0;
    });

    const X =tf.tensor([pixelValue]);
    // console.log(`Shape of tensor ${X.shape}`);
    // console.log(`dataType ${X.dtype}`);
    const prediction= await loadModel(X);
    // preiction=prediction.data()
    
    
    console.log(tf.memory());



    // const outputCanvas = document.createElement('CANVAS');
    // cv.imshow(outputCanvas, image);
    // document.body.appendChild(outputCanvas);

    console.log(`prediction ${prediction}`);

    image.delete();
    cnt.delete();
    hierarchy.delete();
    contours.delete();
    M.delete();
    tf.disposeVariables();
    
    return await prediction;
}