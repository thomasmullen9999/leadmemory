import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cleanOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  return cleaned.length > 0 ? cleaned : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = cleanOptionalText(body.name);
    const email = cleanOptionalText(body.email);
    const phone = cleanOptionalText(body.phone);
    const claimType = cleanOptionalText(body.claimType);
    const claimSummary = cleanOptionalText(body.claimSummary);

    const postcode = cleanOptionalText(body.postcode);
    const preferredContact = cleanOptionalText(body.preferredContact);
    const providerName = cleanOptionalText(body.providerName);
    const claimReference = cleanOptionalText(body.claimReference);
    const issueStartDate = cleanOptionalText(body.issueStartDate);

    const previousComplaint = body.previousComplaint === true;
    const hasSupportingEvidence = body.hasSupportingEvidence === true;
    const consentToContact = body.consentToContact === true;
    const acceptedPrivacyPolicy = body.acceptedPrivacyPolicy === true;

    if (!name || !email || !phone || !claimType || !claimSummary) {
      return NextResponse.json(
        {
          error:
            "Please complete your name, email address, phone number, claim type, and enquiry summary.",
        },
        { status: 400 },
      );
    }

    if (!consentToContact || !acceptedPrivacyPolicy) {
      return NextResponse.json(
        {
          error:
            "You must confirm your contact consent and information declaration before submitting.",
        },
        { status: 400 },
      );
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailIsValid) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const defaultOwner = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!defaultOwner) {
      return NextResponse.json(
        {
          error:
            "We are unable to accept claim enquiries at the moment. Please try again later.",
        },
        { status: 503 },
      );
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        postcode,
        preferredContact,
        claimType,
        providerName,
        claimReference,
        issueStartDate,
        claimSummary,
        previousComplaint,
        hasSupportingEvidence,
        consentToContact,
        privacyAcceptedAt: new Date(),
        status: "NEW_ENQUIRY",
        ownerId: defaultOwner.id,
      },
    });

    return NextResponse.json(
      {
        id: client.id,
        message: "Your enquiry has been submitted successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Claim enquiry submission failed:", error);

    return NextResponse.json(
      {
        error:
          "We could not submit your enquiry right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}