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

# Pre-requisites

## Setup aws cli

- Login to the AWS Root account 571510158769

- Create an iam user

- Put your aws access key into `~/.aws/credentials` under the profile name `benramsden`

```
[benramsden]
aws_access_key_id=
aws_secret_access_key=
```

# Manual deployment steps

## Domain and Hosted Zone

- Create a Google Domain pension-calculator.net

- Create pension-calculator.net hosted zone in Route 53

- Configure Google domain to use hosted zone NS records

# Deploy

- Run up

```shell
pulumi up
```
