'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { getTelegramToken } from '@/features/telegram/services/telegram.client';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TelegramTokenGenerateButton() {
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const router = useRouter();

  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const getToken = async () => {
  //     const { linkToken } = await getTelegramToken();
  //     setToken(linkToken);
  //   };

  //   getToken();
  // }, []);

  const handleOnClick = async () => {
    console.log('clicked clicked');
    setIsLoading(true);
    const { linkToken } = await getTelegramToken();
    setToken(linkToken);
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full" disabled={isLoading} onClick={handleOnClick}>
          <p className="text-sm">Connect Telegram</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <InputGroup className="border-gray-950">
              {isLoading ? (
                <div className="text-muted-foreground flex h-8 flex-1 items-center px-2 text-sm font-normal">
                  Getting Telegram token...
                </div>
              ) : (
                <InputGroupInput
                  placeholder={`/start ${token}`}
                  value={`/start ${token}`}
                  readOnly
                  className="placeholder:text-md h-8 px-2 placeholder:text-black"
                />
              )}
              <InputGroupButton
                aria-label="Copy"
                title="Copy"
                size="icon-xs"
                disabled={isLoading || !token}
                onClick={() => {
                  copyToClipboard(`/start ${token}`);
                }}
              >
                {isCopied ? <Check /> : <Copy />}
              </InputGroupButton>
            </InputGroup>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-800 flex flex-col justify-start items-start gap-2">
            <span>1. Copy the text above</span>
            <span>
              2. Open Telegram and search for{' '}
              <Link
                href="https://t.me/JenianBot"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                @JenianBot
              </Link>{' '}
            </span>
            <span>3. Send the copied text to the bot</span>
            <span>4. You&apos;re all set!</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              router.refresh();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
