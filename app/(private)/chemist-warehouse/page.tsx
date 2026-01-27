import CreateReportButton from '@/components/create-report-button';
import TelegramTokenGenerateButton from '@/components/TelegramTokenGenerateButton';
import { Card, CardAction, CardHeader } from '@/components/ui/card';
import { BotMessageSquare, Clipboard } from 'lucide-react';

const items = [
  {
    itemName: 'Connect to Telegram Chatbot',
    description: 'Set up and connect your Telegram bot to integrate with this app',
    icon: <BotMessageSquare />,
    // status: 'Connected',
    status: {
      code: true,
      description: 'Connected',
    },
    buttonLabel: 'Connect Bot',
    button: <TelegramTokenGenerateButton />,
  },

  {
    itemName: 'Generate end of day report',
    description: 'Input your data and geenrate a comprehensive report',
    icon: <Clipboard />,
    status: {
      code: true,
      description: 'Submited',
    },
    buttonLabel: 'Create report',
    button: <CreateReportButton />,
  },
];

export default function ChemistWarehouse() {
  //INFO: might make separate components for 'Connect to Telegram ...' and 'generate report'

  return (
    <div className="w-full p-2">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Lorem ipsum dolor sit amet.</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt accusamus ut, cupiditate quo nemo amet minima
            nobis iusto nam ad!
          </p>
        </div>
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 "> */}
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            // <Link key={i} href={''}>
            <Card key={i} className="p-2 gap-0">
              <CardHeader className="p-2">
                <div className="flex gap-4 ">
                  <span className="self-center border-2 flex size-10 items-center justify-center rounded-xl border-black">
                    {item.icon}
                  </span>
                  <div>
                    <h1 className="self-center font-semibold text-lg">{item.itemName}</h1>
                    <p className="text-sm  rounded-sm inline-block px-2 bg-green-200 text-gray-700">
                      {item.status.code ? item.status.description : item.status.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              {/* <CardDescription className="px-2">{item.description}</CardDescription> */}
              <CardAction>{item.button}</CardAction>
            </Card>
            // </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
