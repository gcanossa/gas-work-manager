import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { intervalToHours } from "@/lib/utils";
import {
  ActivityTrackType,
  activitiesAmount,
  activityAmount,
} from "@model/activity-track";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export type ActivityTableProps = {
  title: string;
  activities: ActivityTrackType[];
};

export const ActivityTable: React.FC<ActivityTableProps> = ({
  title,
  activities,
}) => {
  const [billableOnly, setBillableOnly] = useState(true);

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          checked={billableOnly}
          onCheckedChange={() => setBillableOnly((p) => !p)}
        />
        <Label>Solo Fatturabili</Label>
      </div>
      <Table className="caption-top">
        <TableCaption>{title}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Progetto</TableHead>
            <TableHead>Servizio</TableHead>
            <TableHead>Descrizione</TableHead>
            <TableHead>Inizio</TableHead>
            <TableHead>Fine</TableHead>
            <TableHead>Durata</TableHead>
            <TableHead>Tariffa</TableHead>
            <TableHead>Moltiplicatore</TableHead>
            <TableHead className="text-right">Totale</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map(
            (p) =>
              (!billableOnly || (billableOnly && p.billable)) && (
                <TableRow
                  key={p.id}
                  className={!p.billable ? "line-through text-slate-300" : ""}
                >
                  <TableCell>{p.projectName}</TableCell>
                  <TableCell>{p.serviceName}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.start.toLocaleString()}</TableCell>
                  <TableCell>{p.end.toLocaleString()}</TableCell>
                  <TableCell>
                    {intervalToHours(p.start, p.end, 2).toFixed(2)}
                  </TableCell>
                  <TableCell>{p.hourlyRate}</TableCell>
                  <TableCell>{p.multiplier}</TableCell>
                  <TableCell className="text-right">
                    {activityAmount(p).toFixed(2)}
                  </TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Totale</TableCell>
            <TableCell className="text-right">
              €{" "}
              {activitiesAmount(activities.filter((p) => p.billable)).toFixed(
                2,
              )}
            </TableCell>
          </TableRow>
          {!billableOnly && (
            <TableRow className="line-through text-slate-300 border-t border-slate-400">
              <TableCell colSpan={8}>Totale non fatturabile</TableCell>
              <TableCell className="text-right">
                €{" "}
                {activitiesAmount(
                  activities.filter((p) => !p.billable),
                ).toFixed(2)}
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>
    </>
  );
};
