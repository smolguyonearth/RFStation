// import { useState } from 'react'

import { Badge } from "../../@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../@/components/ui/card";

export default function test() {

    return (
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <Card className=" bg-yellow-200 h-64 overflow-hidden border-none shadow-sm">
          <CardHeader className="bg-purple-50 flex flex-row justify-between items-center w-full px-6 py-4">
            <div className="flex flex-col h-full justify-center">
              <CardTitle className=" text-4xl text-black dark:text-white">
                Game Console
              </CardTitle>
              <CardDescription className=" text-black dark:text-white">
                ID: 12345
              </CardDescription>
            </div>
            <div className="flex flex-col  h-full justify-center">
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                Win
              </Badge>
              <CardDescription className=" text-black dark:text-white">
                Turn: 10
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </main>
    );
}
