import Model from './_model';

class clerk extends Model {
  constructor(data = { id: null }) {
    // Sets model name and table name
    super({
      data,
      model: 'clerk',
      table: 'clerks',
      model_params: [
        'id', 'Name', 'Party',
      ],
    });
    this.public_key = data.public_key;

    // Mandatory method to be called after data
    this.record = this.setRecord();


    this.validation_rules = [
      // We list all validation rules as a list of hashes
      {
        validate: this.record.Name,
        attribute_name: 'Name',
        rules: {
          required: true,
          dataType: 'String',
        },
      },
      {
        validate: this.record.Party,
        attribute_name: 'Party',
        rules: {
          required: true,
          dataType: 'String',
        },
      },
    ];
  }

  setRecord() {
    // We set default data in this method after calling for the class setRecord method
    const record = super.setRecord(this.data);

    return record;
  }
}

module.exports = clerk;
