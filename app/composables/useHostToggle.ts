/// <reference types="w3c-web-hid" />
const filters = [ { vendorId: '534D', productId: '2109'} ]


export const useHostToggle = () => {
    const { usb } = useBrowserSupport()
    const enabled = useState('host-toggle', () => false)

    const connect = async () => {
        if (!usb) return;

        const ports = await navigator.hid.getDevices()

    }

    return {
        enabled
    }
}