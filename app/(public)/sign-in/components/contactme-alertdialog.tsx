import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import React from 'react';

export default function ContactMeAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="font-semibold underline cursor-pointer">me</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave me a message at:</AlertDialogTitle>
          <AlertDialogDescription>
            <a href="mailto:phucmap3010@gmail.com" className="text-blue-500 hover:underline">
              phucmap3010@gmail.com
            </a>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
