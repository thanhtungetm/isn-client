function disableScroll() {
    const body = document.querySelector('body')
    body.classList.add('fixed')
    body.classList.add('inset-0')
    body.classList.add('overflow-y-scroll')
}

function visibleScroll() {
    const body = document.querySelector('body')
    body.classList.add('overflow-y-scroll')
}

function enableScroll() {
    const body = document.querySelector('body')
    body.classList.remove('fixed')
    body.classList.remove('inset-0')
    // body.classList.remove('overflow-y-scroll')
}

const TO_RADIANS = Math.PI / 180

export async function canvasPreview(
    image,
    canvas,
    crop,
    scale = 1,
    rotate = 0,
    transX = 0,
    transY = 0
) {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    // console.log('Preview WH', image.width, image.height)
    console.log('Natural wH', image.naturalWidth, image.naturalHeight)

    const scaleX = image.naturalWidth / image.width
    const scaleY = scaleX
    // image.naturalHeight / image.height

    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio
    // const pixelRatio = 1

    canvas.width = crop.width * scaleX * pixelRatio
    canvas.height = crop.height * scaleY * pixelRatio
    // console.log(crop);
    console.log("canvas",canvas.width,canvas.height);
    console.log("canvas height",crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    const rotateRads = rotate * TO_RADIANS
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY)
    // 3) Rotate around the origin
    ctx.rotate(rotateRads)
    // 2) Scale the image
    ctx.scale(scale, scale)
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY)

    ctx.drawImage(
        image,
        -transX * scaleX,
        -transY * scaleY,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
    )

    ctx.restore()
}
const filters = {
    original: '',
    clarendon: 'sepia(.15) contrast(1.25) brightness(1.25) hue-rotate(5deg)',
    gingham: 'contrast(1.1) brightness(1.1)',
    juno: 'sepia(.35) contrast(1.15) brightness(1.15) saturate(1.8)',
    lark: 'sepia(.25) contrast(1.2) brightness(1.3) saturate(1.25)',
    slumber: 'sepia(.35) contrast(1.25) saturate(1.25)',
    reyes: 'sepia(.75) contrast(.75) brightness(1.25) saturate(1.4)',
    crema: 'sepia(.5) contrast(1.25) brightness(1.15) saturate(.9) hue-rotate(-2deg)',
    moon: 'brightness(1.4) contrast(.95) saturate(0) sepia(.35)',
}
export async function canvasFilteredPreview(image, canvas, filter, aspect) {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    const imgwidth = image.naturalWidth
    const imgheight = image.naturalHeight

    canvas.width = aspect.width
    canvas.height = aspect.height

    console.log('Apply Filter', filter)
    ctx.filter = filters[filter]

    ctx.drawImage(image, 0, 0, imgwidth, imgheight, 0,0, aspect.width, aspect.height)

    ctx.restore()
}

function toBlob(canvas) {
    return new Promise((resolve) => {
        canvas.toBlob(resolve)
    })
}

// Returns an image source you should set to state and pass
// `{previewSrc && <img alt="Crop preview" src={previewSrc} />}`
export async function imgPreview(image, crop, scale = 1, rotate = 0, transX = 0, transY = 0) {
    const canvas = document.createElement('canvas')
    // console.log("Preview",image, crop);
    canvasPreview(image, canvas, crop, scale, rotate, transX, transY)

    const blob = await toBlob(canvas)
    //   if (previewUrl) {
    //     URL.revokeObjectURL(previewUrl)
    //   }

    const previewUrl = URL.createObjectURL(blob)
    return previewUrl
}
function getAspect(aspect){
    switch(aspect){
        case 16/9: return {width:1280, height:720}
        case 4/5: return {width:480, height:600}
        default: return {width:1080, height:1080}
    }
}

export async function imgFilteredPreview(image, filter = 'original', aspect ) {
    console.log('Generate Blob for filtered', image, filter,aspect)
    const canvas = document.createElement('canvas')
    canvasFilteredPreview(image, canvas, filter,getAspect(aspect))

    const blob = await toBlob(canvas)

    // const previewUrl = URL.createObjectURL(blob)
    return blob
}

function optimizePixelCrop(crop,aspect){
    console.log("Crop", crop);
    const newCrop = {...crop}
    newCrop.x = Math.floor(newCrop.x)
    newCrop.y = Math.floor(newCrop.y)
    newCrop.width = Math.floor(newCrop.width)
    newCrop.height = newCrop.width/aspect
    console.log("New Crop", newCrop);
    return newCrop
}

const helper = { disableScroll, enableScroll, canvasPreview, imgPreview, imgFilteredPreview, visibleScroll, optimizePixelCrop }
export default helper
