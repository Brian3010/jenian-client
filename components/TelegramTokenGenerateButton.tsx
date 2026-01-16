'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Check, Copy } from 'lucide-react';
import React from 'react';
import { InputGroup, InputGroupButton, InputGroupInput } from './ui/input-group';

export default function TelegramTokenGenerateButton() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  //TODO: Call API to get token
  //TODO: have a look at proxy for private route impelmentation
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Connect Bot</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <InputGroup className="border-gray-950">
              <InputGroupInput
                placeholder="/start Token here"
                disabled
                className="placeholder:text-md h-8 px-2 placeholder:text-black"
              />
              <InputGroupButton
                aria-label="Copy"
                title="Copy"
                size="icon-xs"
                onClick={() => {
                  copyToClipboard('/start token here');
                }}
              >
                {isCopied ? <Check /> : <Copy />}
              </InputGroupButton>
            </InputGroup>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-800">
            Copy the text above and send it to JenianBot in Telegram to link your Telegram account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
