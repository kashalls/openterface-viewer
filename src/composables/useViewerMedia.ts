export const useViewerMedia = () => {
    const enabled = useState('media', () => false)

    const camera = useState('camera')

    return {
        enabled,
        camera
    }
}