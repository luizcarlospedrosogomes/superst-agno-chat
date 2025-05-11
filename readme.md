# run localhost
## windows
- python -m venv venv310
- .\venv310\Scripts\Activate.ps1
- pip install --only-binary :all: psycopg2-binary
- pip install -r requirements.txt

## linux 
- python -m venv venv310
- source venv310/bin/activate
- pip install marshmallow==3.20.1
- pip install -r requirements.txt
- export PYTHONPATH=$PYTHONPATH:/home/lcpg/LCPG/PROJETOS/superset_agno
- export SUPERSET_CONFIG_PATH=$(pwd)/superset_agno/superset_config.py
# exit localhost virtual env
- deactivate