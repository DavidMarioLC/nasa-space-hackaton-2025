"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export const AirLegendTable = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Air Quality Index (UAQI)</CardTitle>
        <CardDescription>Description of air quality levels</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption className="sr-only">
            Air Quality Legend Table
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Badge className="bg-[#009E3A] "> 100-80</Badge>
              </TableCell>
              <TableCell>Excellent air quality</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Badge className="bg-[#84CF33] ">79-60</Badge>
              </TableCell>
              <TableCell>Good air quality</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Badge className="bg-[#F6EB61] ">59-40</Badge>
              </TableCell>
              <TableCell>Moderate air quality</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Badge className="bg-[#FF8C00]">39-20</Badge>
              </TableCell>
              <TableCell>Low air quality</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Badge className="bg-[#FF0000]">19-1</Badge>
              </TableCell>
              <TableCell>Poor air quality</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Badge className="bg-[#FF0000]">0</Badge>
              </TableCell>
              <TableCell>Very poor air quality</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
