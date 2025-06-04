import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }: ConfirmDeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Pelanggaran?</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Apakah Anda yakin ingin menghapus pelanggaran ini? Tindakan ini tidak dapat dibatalkan.
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
