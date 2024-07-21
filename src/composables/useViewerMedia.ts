export const useViewerMedia = () => {

    const toast = useToast()
    const enabled = useState('media', () => false)
    const settings = useState<MediaTrackSettings | null>('media-settings')

    const connect = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: CAMERA_HIGH_RES })
            .catch((error) => handleMediaError(error))

        if (!stream) return;

        const video = document.querySelector('video') as HTMLVideoElement
        video.srcObject = stream
        enabled.value = true

        const track = stream.getVideoTracks()[0]
        settings.value = track.getSettings()
    }

    const disconnect = () => {
        const video = document.querySelector('video') as HTMLVideoElement

        if (video.srcObject) {
            const src = video.srcObject as MediaStream
            src.getTracks().forEach((track: MediaStreamTrack) => track.stop())
        }

        video.srcObject = null
        enabled.value = false
        settings.value = null
    }

    const handleMediaError = (error: DOMException) => {
        if (error instanceof DOMException) {
            if (error.name === 'NotAllowedError') {
                toast.add({ 
                    title: 'Connection Failed',
                    description: 'You or your browser has denied permission to the Openterface camera. Openterface viewer needs access to this camera in order to function.'
                })
            } else if  (error.name === 'NotFoundErr') {
                toast.add({
                    title: 'Camera Not Found',
                    description: 'We were unable to find an openterface camera to connect to. Please make sure you have your device connected.'
                })
            } else {
                console.log(`[Camera Error] ${error}`)
                toast.add({
                    title: 'Camera Error',
                    description: 'We tried to you the openterface stream, but for whatever reason it stopped working.'
                })
            }
        }
        return console.error(`Unhandled Error: ${error}`)
    }

    return {
        enabled,
        settings,
        connect,
        disconnect
    }
}