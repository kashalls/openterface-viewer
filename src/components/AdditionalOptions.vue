<script setup lang="ts">
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const openOptions = ref(false)
const showDeleteDialog = ref(false)
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="secondary">
                <span class="sr-only">Actions</span>
                <Icon name="radix-icons:dots-horizontal" class="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="bg-background">
            <DropdownMenuItem @select="openOptions = true">
                Video Options
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="text-red-600" @select="showDeleteDialog = true">
                Forget Devices
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    <Dialog v-model:open="openOptions">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Video Options</DialogTitle>
                <DialogDescription>
                    If for some reason your Openterface isn't working with the default settings,
                    you can configure some of your devices settings here.
                </DialogDescription>
            </DialogHeader>
            <div class="">
                <h4 class="text-sm text-muted-foreground">
                    Resolution
                </h4>
                <Select>
                    <SelectTrigger class="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem v-for="item in CAMERA_RESOLUTIONS" :value="item.label">
                                {{ item.label }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="secondary" @click="openOptions = false">
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    <AlertDialog v-model:open="showDeleteDialog">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This preset will no longer be
                    accessible by you or others you&apos;ve shared it with.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" @click="showDeleteDialog = false">
                    Delete
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>