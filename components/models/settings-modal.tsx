"use client";

import {
    Dialog,
    DialogHeader,
    DialogContent,
} from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import {Label} from "@/components/ui/label";
import { ToggleTheme } from "@/components/ui/toggle-theme";

export function SettingsModal(){
    const settings = useSettings();
    return (
        <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-semibold">My Settings</h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>
                            Appearance
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">Customize how motion looks on your device</span>
                    </div>
                    <ToggleTheme />
                </div>
            </DialogContent>
        </Dialog>
    )
}