const AI = {

  analyzeCase(caseId){

    const cases =
      Storage.get("cases");

    const c =
      cases.find(x=>x.id===caseId);

    if(!c) return null;

    const text =
      JSON.stringify(c).toLowerCase();

    let score = 50;
    let charges = [];

    // BASIC RULE ENGINE (FREE AI)

    if(text.includes("speed") ||
       text.includes("mph")){
      charges.push("Reckless Driving");
      score += 20;
    }

    if(text.includes("fled") ||
       text.includes("chase")){
      charges.push("Evading Police");
      score += 25;
    }

    if(text.includes("weapon") ||
       text.includes("gun")){
      charges.push("Armed Possession");
      score += 30;
    }

    if(charges.length === 0){
      charges.push("Insufficient Data");
    }

    return {

      caseId,

      recommendedCharges: charges,

      confidence: Math.min(score,99),

      fine:
        `$${charges.length * 1000}`,

      jail:
        `${charges.length * 10} days`,

      summary:
        "Analysis based on officer report and case data."

    };

  }

};
