export const useViewerMedia = () => {

    const showAllDevices = useState('media-show-all', () => false)
    const toast = useToast()
    const enabled = useState('media', () => false)
    const settings = useState<MediaTrackSettings | null>('media-settings')
    const capabilities = useState('media-capabilities')
    const selectedDevice = useState('media-selected', () => '')
    const devices = useState<MediaDeviceInfo[]>('media-devices', () => [])

    onMounted(() => {
        refreshDevices()
    })

    const connect = async () => {
        if (!('mediaDevices' in navigator)) return;
        await refreshDevices()
        await changeDevice(devices.value[0].deviceId)
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
        capabilities.value = null
        selectedDevice.value = ''
    }

    const handleMediaError = (error: DOMException) => {
        if (error instanceof DOMException) {
            if (error.name === 'NotAllowedError') {
                toast.add({
                    title: 'Connection Failed',
                    description: 'You or your browser has denied permission to the Openterface camera. Openterface viewer needs access to this camera in order to function.'
                })
            } else if (error.name === 'NotFoundErr') {
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

    const apply = async (settings: MediaTrackConstraints) => {
        const video = document.querySelector('video') as HTMLVideoElement
        if (!video || !video.srcObject) return;
        const stream = video.srcObject as MediaStream
        const track = stream.getVideoTracks()[0]
        try {
            await track.applyConstraints(settings)
            console.log('Applied new camera settings:', settings)
        } catch (err) {
            console.error(err)
        }
    }

    const changeDevice = async (deviceId: string): Promise<void> => {
        selectedDevice.value = deviceId
        const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId, ...CAMERA_HIGH_RES } })
            .catch(handleMediaError)
        
        // Need to better handle this error if no device is found.
        if (!stream) return;

        const video = document.querySelector('video') as HTMLVideoElement
        video.srcObject = stream
        enabled.value = true

        const track = stream.getVideoTracks()[0]
        settings.value = track.getSettings()
        capabilities.value = track.getCapabilities()
    }

    const refreshDevices = async () => {
        const mediaDevices: void | MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices()
            .then((devices) => devices.filter((device) => device.kind === 'videoinput'))
            .catch(handleMediaError)
        // Need to better handle this error if no device is found.
        if (!mediaDevices) return;

        if (selectedDevice.value === '') {
            selectedDevice.value = mediaDevices[0].deviceId
        }

        devices.value = mediaDevices
        return mediaDevices
    }

    return {
        enabled,
        settings,
        capabilities,
        showAllDevices,
        devices,
        selectedDevice,
        apply,
        connect,
        disconnect,
        refreshDevices,
        changeDevice
    }
}