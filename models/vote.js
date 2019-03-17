import Model from './_model';

class vote extends Model {
  constructor(data = { id: null }) {
    // Sets model name and table name
    super({
      data,
      model: 'vote',
      table: 'votes',
      model_params: [
        'id', 'Position', 'Candidate', 'Party', 'VoteFor',
      ],
    });
    this.public_key = data.public_key;

    // Mandatory method to be called after data
    this.record = this.setRecord();


    this.validation_rules = [
      // We list all validation rules as a list of hashes
      {
        validate: this.record.Position,
        attribute_name: 'Position',
        rules: {
          required: true,
          dataType: 'String',
        },
      },
      {
        validate: this.record.Candidate,
        attribute_name: 'Candidate',
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
      {
        validate: this.record.VoteFor,
        attribute_name: 'VoteFor',
        rules: {
          required: true,
          dataType: 'Boolean',
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

module.exports = vote;
