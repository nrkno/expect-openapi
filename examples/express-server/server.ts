import express from "express";

const legalAgeV1_0 = "application/vnd.nrk.legal-age.1.0+json";

export const rated = {
  legalReference: "LOV2015-02-06-7",
  body: {
    rating: {
      code: "12",
      displayValue: "Aldersgrense 12 år",
      displayAge: "12+"
    },
    status: "rated"
  }
};

export const exempt = {
  legalReference: "LOV2015-02-06-7",
  body: { status: "exempt" }
};

export const app = express();

app.get("/rating/:programId", (req, res) => {
  const programId: string = req.params.programId;
  if (!programId) {
    res.sendStatus(404);
  } else if (programId === "exempt") {
    res.set("Content-Type", legalAgeV1_0);
    res.send(exempt);
  } else if (programId === "rated") {
    res.set("Content-Type", legalAgeV1_0);
    res.send(rated);
  } else if (programId === "invalid-body") {
    const legalAge = {
      legalReference: "LOV2015-02-06-7",
      body: "invalid"
    };
    res.set("Content-Type", legalAgeV1_0);
    res.send(legalAge);
  } else if (programId === "invalid-content-type") {
    const legalAge = {
      legalReference: "LOV2015-02-06-7",
      body: "invalid"
    };
    res.set("Content-Type", "application/json");
    res.send(legalAge);
  } else if (programId === "invalid-status") {
    const legalAge = {
      message: "bad request"
    };
    res.status(400);
    res.set("Content-Type", "application/json");
    res.send(legalAge);
  }
});
