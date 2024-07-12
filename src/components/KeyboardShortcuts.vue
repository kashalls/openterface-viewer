<script lang="ts" setup>
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const { isConnected } = useSerial()

const buttons = [
    {
        icon: 'i-mdi:keyboard-f1',
        key: WINDOWS_KEYMAP['F1']
    },
    {
        icon: 'i-mdi:keyboard-f2',
        key: WINDOWS_KEYMAP['F2']
    },
    {
        icon: 'i-mdi:keyboard-f3',
        key: WINDOWS_KEYMAP['F3']
    },
    {
        icon: 'i-mdi:keyboard-f4',
        key: WINDOWS_KEYMAP['F4']
    },
    {
        icon: 'i-mdi:keyboard-f5',
        key: WINDOWS_KEYMAP['F5']
    },
    {
        icon: 'i-mdi:keyboard-f6',
        key: WINDOWS_KEYMAP['F6']
    },
    {
        icon: 'i-mdi:keyboard-f7',
        key: WINDOWS_KEYMAP['F7']
    },
    {
        icon: 'i-mdi:keyboard-f8',
        key: WINDOWS_KEYMAP['F8']
    },
    {
        icon: 'i-mdi:keyboard-f9',
        key: WINDOWS_KEYMAP['F9']
    },
    {
        icon: 'i-mdi:keyboard-f10',
        key: WINDOWS_KEYMAP['F10']
    },
    {
        icon: 'i-mdi:keyboard-f11',
        key: WINDOWS_KEYMAP['F11']
    },
    {
        icon: 'i-mdi:keyboard-f12',
        key: WINDOWS_KEYMAP['F12']
    },
    {
        icon: 'i-tabler:http-delete',
        key: WINDOWS_KEYMAP['Delete']
    },
    {
        icon: 'i-tabler:brand-windows',
        key: WINDOWS_KEYMAP['met']
    }
]
</script>

<template>
    <div class="flex flex-row">
        <Button></Button></div>
</template>