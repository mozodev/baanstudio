---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
year_month: {{ .Date.format "2006-01"  }}
client: ""
---

