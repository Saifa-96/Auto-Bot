import numpy as np
import json
from core.declaration import NextStep, Task, TASK_TYPE


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


def json_stringify(obj):
    return json.dumps(obj, cls=NpEncoder)


def cvt_node_to_task(node_json: dict, next_steps: list[NextStep]):
    return Task(
        id=node_json["id"],
        type=node_json["type"],
        data=node_json["data"],
        next_steps=next_steps,
    )


def cvt_flow_json_to_tasks(flow_json: dict) -> list[Task]:
    nodes_json = flow_json["nodes"]
    edges_json = flow_json["edges"]

    output_dict = {}
    for edge_json in edges_json:
        source_id: str = edge_json["source"]
        target_id: str = edge_json["target"]
        source_handle_id = edge_json["sourceHandle"]
        next_step = NextStep(id=source_handle_id, next_task_id=target_id)

        if source_id in output_dict:
            outputs: list[NextStep] = output_dict[source_id]
            outputs.append(next_step)
        else:
            output_dict[source_id] = [next_step]

    return list(
        map(
            lambda node_json: cvt_node_to_task(
                node_json=node_json,
                next_steps=output_dict[node_json["id"]]
                if node_json["id"] in output_dict
                else [],
            ),
            nodes_json,
        )
    )


def to_flow_json_dict(flows_json: list):
    flow_json_dict = {}
    for flow_json in flows_json:
        flow_json_dict[flow_json["id"]] = flow_json
    return flow_json_dict


def get_start_task_id(task_list: list[Task]):
    for task in task_list:
        if task.type == TASK_TYPE.START:
            return task.id


def adapt_config(config_json: dict, flow_id: str):
    flows_json: list = config_json["flows"]
    flow_json_dict = to_flow_json_dict(flows_json)
    main_flow_json = flow_json_dict[flow_id]
    tasks = cvt_flow_json_to_tasks(main_flow_json)
    start_task_id = get_start_task_id(tasks)

    return tasks, start_task_id
