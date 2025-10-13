import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import getCarRentalDetails from "@/lib/utils/server/get-car-rental-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import EditCarRentalClient from "../components/edit-car-rental-client";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditCarRental({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getCarRentalDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Car Rental" prevPage="/admin/car-rental" />

      <div className="grid grid-cols-10 gap-6 mt-6">
        {/* Left Side - 7/10 width */}
        <div className="col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Car Rental Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_name">User Name</Label>
                  <Input
                    id="user_name"
                    defaultValue={data.user_name}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={data.email}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact</Label>
                  <Input id="contact" defaultValue={data.contact} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_people">Max People</Label>
                  <Input
                    id="max_people"
                    type="number"
                    defaultValue={data.max_people}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type</Label>
                  <Input
                    id="type"
                    defaultValue={data.type}
                    readOnly
                    className="capitalize"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup_time">Pickup Time</Label>
                  <Input
                    id="pickup_time"
                    defaultValue={format(new Date(data.pickup_time), "PPp")}
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickup_address">Pickup Address</Label>
                <Input
                  id="pickup_address"
                  defaultValue={data.pickup_address}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination_address">Destination Address</Label>
                <Input
                  id="destination_address"
                  defaultValue={data.destination_address}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  defaultValue={data.message}
                  readOnly
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - 3/10 width */}
        <div className="col-span-3 space-y-4">
          <EditCarRentalClient id={id} initialStatus={data.status} />

          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="static_message">Message</Label>
                <Textarea
                  id="static_message"
                  placeholder="Type your message here..."
                  rows={5}
                />
              </div>
              <Button className="w-full" variant="outline">
                Send Mail
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EditCarRental;
export const dynamic = "force-dynamic";
