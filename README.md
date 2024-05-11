# pension-calculator-web

[pension-calculator.net](https://pension-calculator.net)

# Data

- Life expectancy projection [ONS](https://www.ons.gov.uk/peoplepopulationandcommunity/birthsdeathsandmarriages/lifeexpectancies/datasets/expectationoflifeprincipalprojectionunitedkingdom)
  - Books
    - males cohort ex
    - females cohort ex
  - Conversion steps
    - delete text
    - select all
    - paste into another doc
    - save as csv
    - use csv to json converter
- Salary percentiles by age [ONS](https://occaminvesting.co.uk/average-uk-salary-by-age/)
- State pension age [Which](https://www.which.co.uk/money/pensions-and-retirement/state-pension/state-pension-age-calculator-aIGrn9D5tei4)
- Earnings over time [ONS](https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/agegroupashetable6)
  - Doc: `Annual pay - Gross 2022`
  - Book: `Full-Time`
  - Column: `Median`

# Development

- Put defaults into `.env.development` matching `app/src/config/index.ts` to speed up development.

# Manual deployment steps

## Domain and Hosted Zone

- Create a hosted zone in Route 53

- Set `static-website:targetDomain` in `pulumi/Pulumi.prod.yaml` to this domain

# Deploy

- Run up

```shell
pulumi up
```
