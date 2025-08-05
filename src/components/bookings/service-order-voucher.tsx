import React, { forwardRef } from "react";
import ChnLogoLight from "@/images/chn-logo-light.png";
import Image from "next/image";

interface Props {
  bookingNo: string | null | undefined;
  group: string | null | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  guests: number | undefined;
  ceo: string | null | undefined;
  room: string | null | undefined;
  note: string | null | undefined;
}

function ServiceOrderVoucher({ bookingNo, group, fromDate, toDate, guests, ceo, room, note }: Props, ref: any) {
  return (
    <div className="bg-white w-full h-full p-5 *:!text-black flex flex-col gap-5" ref={ref}>
      <Image className="" width={150} src={ChnLogoLight} alt="Community Homestay Logo" />
      <div>
        <h1 className="text-lg font-semibold">Community Homestay Network Pvt. Ltd</h1>
        <p>
          P.O.Box 8720
          <br />
          Lal Durbar Marg, Kathmandu, Nepal
          <br />
          <span className="font-medium">Phone:</span> +977-1-4444376/78/79 Ext No:123
          <br />
          <span className="font-medium">Fax:</span> 00977-1-4444380
          <br />
          <span className="font-medium">Email:</span>{" "}
          <a href="mailto:info@communityhomestay.com">info@communityhomestay.com</a>
        </p>
      </div>
      <h2 className="text-center underline font-semibold text-lg">SERVICE ORDER VOUCHER</h2>
      <div>
        <p>
          <span className="font-medium">To:</span> Reservation Manager
        </p>
        <p>Panauti Community Homestay</p>
      </div>
      <div>
        <p>Dear Sir/Madam,</p>
        <p>We would like to request you to provide the following services to our valuable guest:</p>
      </div>
      <table>
        <tbody className="[&_td]:border [&_td]:p-1 [&_td:first-child]:font-medium [&_td:first-child]:whitespace-nowrap">
          <tr>
            <td>Booking Ref. No</td>
            <td>{bookingNo}</td>
          </tr>
          <tr>
            <td>Group Name</td>
            <td>{group}</td>
          </tr>
          <tr>
            <td>Date of Arrival</td>
            <td>{fromDate}</td>
          </tr>
          <tr>
            <td>Date of Departure</td>
            <td>{toDate}</td>
          </tr>
          <tr>
            <td>Total Guest</td>
            <td>
              {guests} {ceo && "+ 1 CEO"}
            </td>
          </tr>
          <tr>
            <td>Name of CEO</td>
            <td>{ceo}</td>
          </tr>
          <tr>
            <td>Room Required</td>
            <td>
              {room} {ceo && "+ 1 Single Guide"}
            </td>
          </tr>
          <tr>
            <td>Note</td>
            <td>{note}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <p>Thank you for your kind cooperation.</p>
        <p>Authorized</p>
        <p className="mb-10">Signature</p>
      </div>
      <div>
        <h2 className="font-medium">Community Homestay</h2>
        <p>
          Lal Durbar Marg, Kathmandu, Nepal
          <br />
          <span className="font-medium">Phone:</span> +977-1-4444376/78/79 Ext No:123
          <br />
          <span className="font-medium">Fax:</span> 00977-1-4444380
          <br />
          <span className="font-medium">Mobile No:</span> +977-9801902571
          <br />
          <span className="font-medium">Email:</span>{" "}
          <a href="mailto:info@communityhomestay.com">info@communityhomestay.com</a>
          <br />
          <span className="font-medium">Website:</span>{" "}
          <a href="https://communityhomestay.com">communityhomestay.com</a>
        </p>
      </div>
    </div>
  );
}

export default forwardRef(ServiceOrderVoucher);
